// src/app/api/tts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { openai, OPENAI_CONFIG } from '@/lib/openai';

// ✅ FORÇAR ROTA DINÂMICA
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (text.length > 4096) {
      return NextResponse.json(
        { error: 'Text is too long (max 4096 characters)' },
        { status: 400 }
      );
    }

    // Gera áudio usando OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: OPENAI_CONFIG.speechModel,
      voice: OPENAI_CONFIG.voice,
      input: text,
      speed: 1.0,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Converte para base64
    const base64Audio = buffer.toString('base64');
    const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

    return NextResponse.json({
      audioUrl,
      success: true,
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}