import { NextRequest, NextResponse } from 'next/server';
import { analyzeDocument, DocumentAnalysisRequest } from '@/lib/api/llm';

export async function POST(request: NextRequest) {
  try {
    const body: DocumentAnalysisRequest & { provider?: string } = await request.json();
    const { document, analysisType, customPrompt, provider = 'openai' } = body;

    if (!document || !document.title || !document.content) {
      return NextResponse.json(
        { error: 'Doküman bilgileri eksik' },
        { status: 400 }
      );
    }

    if (!analysisType) {
      return NextResponse.json(
        { error: 'Analiz türü belirtilmelidir' },
        { status: 400 }
      );
    }

    const analysisRequest: DocumentAnalysisRequest = {
      document,
      analysisType,
      customPrompt
    };

    const result = await analyzeDocument(
      analysisRequest, 
      provider as 'openai' | 'anthropic' | 'google'
    );

    return NextResponse.json({
      success: true,
      analysis: result.content,
      metadata: result.metadata
    });

  } catch (error) {
    console.error('AI Analysis API error:', error);
    
    // API anahtarı eksikse özel mesaj
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'AI servis yapılandırması eksik' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Analiz sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Desteklenen analiz türleri
export async function GET() {
  return NextResponse.json({
    supportedAnalysisTypes: [
      {
        id: 'summary',
        name: 'Özet',
        description: 'Dokümanın kısa ve öz bir özetini oluşturur'
      },
      {
        id: 'legal_analysis',
        name: 'Hukuki Analiz',
        description: 'Dokümanın hukuki boyutlarını detaylı analiz eder'
      },
      {
        id: 'key_points',
        name: 'Ana Noktalar',
        description: 'Dokümanın önemli noktalarını listeler'
      },
      {
        id: 'similar_cases',
        name: 'Benzer Davalar',
        description: 'Benzer hukuki durumları ve emsal kararları belirler'
      }
    ],
    supportedProviders: [
      {
        id: 'openai',
        name: 'ChatGPT',
        available: !!process.env.OPENAI_API_KEY
      },
      {
        id: 'anthropic',
        name: 'Claude',
        available: !!process.env.ANTHROPIC_API_KEY
      },
      {
        id: 'google',
        name: 'Gemini',
        available: !!process.env.GOOGLE_AI_API_KEY
      }
    ]
  });
}