import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { openai, OPENAI_CONFIG } from '@/lib/openai';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    console.log('🔵 [CHAT] Iniciando requisição...');

    const { userId: clerkId } = await auth();
    console.log('🔵 [CHAT] clerkId:', clerkId);

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { message, conversationId } = body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log('📨 [CHAT] Mensagem recebida:', message);
    console.log('🔗 [CHAT] conversationId recebido:', conversationId);

    // Buscar usuário
    // @ts-ignore
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!user) {
      console.log('🔴 [CHAT] Usuário não encontrado');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('👤 [CHAT] Usuário:', user.id);

    // 🔧 Reutilizar conversa existente OU criar nova
    let conversation: any = null;

    if (conversationId) {
      // @ts-ignore
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });
    }

    if (!conversation) {
      // @ts-ignore
      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          title: message.slice(0, 50),
        },
      });
      console.log('💬 [CHAT] Nova conversa criada:', conversation.id);
    } else {
      console.log('💬 [CHAT] Reutilizando conversa existente:', conversation.id);
    }

    // 🔧 Carregar histórico ANTES de salvar a mensagem atual
    // (últimas 10 mensagens = contexto suficiente sem estourar tokens)
    // @ts-ignore
    const historyRaw = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    const history = historyRaw.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    console.log(`🧠 [CHAT] Histórico carregado: ${history.length} mensagens`);

    // Salvar a mensagem atual do usuário
    // @ts-ignore
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message.trim(),
      },
    });
    console.log('💬 [CHAT] Mensagem do usuário salva');

    // Montar mensagens para OpenAI: system + histórico + mensagem atual
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message.trim() },
    ];

    console.log('🔵 [CHAT] Chamando OpenAI com modelo:', OPENAI_CONFIG.model);

    const response = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: formattedMessages as any,
      temperature: OPENAI_CONFIG.temperature,
      max_tokens: OPENAI_CONFIG.maxTokens,
    });

    console.log('🔵 [CHAT] Resposta recebida da OpenAI');

    const content = response.choices[0]?.message?.content;

    if (!content) {
      console.log('🔴 [CHAT] Resposta vazia da OpenAI');
      return NextResponse.json(
        { error: 'OpenAI returned empty response' },
        { status: 500 }
      );
    }

    console.log('✅ [CHAT] Conteúdo da resposta:', content);

    // Salvar resposta da IA
    // @ts-ignore
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: content,
      },
    });
    console.log('💬 [CHAT] Resposta da IA salva');

    return NextResponse.json({
      content,
      conversationId: conversation.id,
      role: 'assistant',
    });

  } catch (error: any) {
    console.error('🔴 [CHAT] Erro geral:', error?.message || error);
    return NextResponse.json(
      {
        error:
          'Internal server error: ' +
          (error instanceof Error ? error.message : 'Unknown'),
      },
      { status: 500 }
    );
  }
}