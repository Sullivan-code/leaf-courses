// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { openai, OPENAI_CONFIG } from '@/lib/openai';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { prisma } from '@/lib/prisma';

// ✅ FORÇAR ROTA DINÂMICA
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    console.log('🔵 [CHAT] Iniciando requisição...');
    
    const { userId: clerkId } = await auth();
    console.log('🔵 [CHAT] clerkId:', clerkId);
    
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { message, stream = false } = body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('📨 [CHAT] Mensagem recebida:', message);

    // Buscar usuário
    // @ts-ignore
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!user) {
      console.log('🔴 [CHAT] Usuário não encontrado');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('👤 [CHAT] Usuário:', user.id);

    // Criar conversa
    // @ts-ignore
    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        title: message.slice(0, 50),
      },
    });
    console.log('💬 [CHAT] Conversa criada:', conversation.id);

    // Salvar mensagem do usuário
    // @ts-ignore
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message.trim(),
      },
    });
    console.log('💬 [CHAT] Mensagem do usuário salva');

    // Preparar mensagens para OpenAI
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message.trim() },
    ];

    console.log('🔵 [CHAT] Chamando OpenAI com modelo:', OPENAI_CONFIG.model);

    try {
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

      console.log('✅ [CHAT] Resposta enviada com sucesso');

      return NextResponse.json({
        content,
        conversationId: conversation.id,
        role: 'assistant',
      });

    } catch (openaiError: any) {
      console.error('🔴 [CHAT] Erro na OpenAI:');
      console.error('🔴 [CHAT] Mensagem:', openaiError.message);
      console.error('🔴 [CHAT] Status:', openaiError.status);
      
      return NextResponse.json(
        { error: 'OpenAI error: ' + (openaiError.message || 'Unknown') },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('🔴 [CHAT] Erro geral:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown') },
      { status: 500 }
    );
  }
}