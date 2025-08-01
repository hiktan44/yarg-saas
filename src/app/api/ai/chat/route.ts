import { NextRequest, NextResponse } from 'next/server';
import { askQuestionAboutDocument, LLMMessage } from '@/lib/api/llm';

interface ChatRequest {
  document: {
    title: string;
    content: string;
    institution: string;
  };
  question: string;
  conversationHistory?: LLMMessage[];
  provider?: 'openai' | 'anthropic' | 'google';
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { 
      document, 
      question, 
      conversationHistory = [], 
      provider = 'openai' 
    } = body;

    if (!document || !document.title || !document.content) {
      return NextResponse.json(
        { error: 'Doküman bilgileri eksik' },
        { status: 400 }
      );
    }

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Soru metni gereklidir' },
        { status: 400 }
      );
    }

    const result = await askQuestionAboutDocument(
      document,
      question.trim(),
      conversationHistory,
      provider
    );

    return NextResponse.json({
      success: true,
      response: result.content,
      metadata: result.metadata
    });

  } catch (error) {
    console.error('AI Chat API error:', error);
    
    // API anahtarı eksikse özel mesaj
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'AI servis yapılandırması eksik' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Soru yanıtlanırken bir hata oluştu' },
      { status: 500 }
    );
  }
}