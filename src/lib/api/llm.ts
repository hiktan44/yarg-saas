import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// LLM istemcilerini yapılandır
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

const googleAI = process.env.GOOGLE_AI_API_KEY ? new GoogleGenerativeAI(
  process.env.GOOGLE_AI_API_KEY
) : null;

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMResponse {
  content: string;
  provider: 'openai' | 'anthropic' | 'google';
  metadata: {
    model: string;
    tokenCount?: number;
    processingTime: number;
  };
}

export interface DocumentAnalysisRequest {
  document: {
    title: string;
    content: string;
    institution: string;
    date: string;
  };
  analysisType: 'summary' | 'legal_analysis' | 'key_points' | 'similar_cases';
  customPrompt?: string;
}

// OpenAI API çağrısı
export async function callOpenAI(
  messages: LLMMessage[],
  model = 'gpt-4'
): Promise<LLMResponse> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const startTime = Date.now();

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
      max_tokens: 2000
    });

    const processingTime = Date.now() - startTime;
    const content = completion.choices[0]?.message?.content || '';

    return {
      content,
      provider: 'openai',
      metadata: {
        model,
        tokenCount: completion.usage?.total_tokens,
        processingTime
      }
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('OpenAI API request failed');
  }
}

// Anthropic Claude API çağrısı
export async function callAnthropic(
  messages: LLMMessage[],
  model = 'claude-3-sonnet-20240229'
): Promise<LLMResponse> {
  if (!anthropic) {
    throw new Error('Anthropic API key not configured');
  }

  const startTime = Date.now();

  try {
    // System mesajını ayır
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const conversationMessages = messages.filter(m => m.role !== 'system');

    const message = await (anthropic as any).messages.create({
      model,
      max_tokens: 2000,
      system: systemMessage,
      messages: conversationMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    });

    const processingTime = Date.now() - startTime;
    const content = message.content[0]?.type === 'text' ? message.content[0].text : '';

    return {
      content,
      provider: 'anthropic',
      metadata: {
        model,
        tokenCount: message.usage.input_tokens + message.usage.output_tokens,
        processingTime
      }
    };
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw new Error('Anthropic API request failed');
  }
}

// Google Gemini API çağrısı
export async function callGoogle(
  messages: LLMMessage[],
  model = 'gemini-pro'
): Promise<LLMResponse> {
  if (!googleAI) {
    throw new Error('Google AI API key not configured');
  }

  const startTime = Date.now();

  try {
    const genModel = googleAI.getGenerativeModel({ model });
    
    // Mesajları Google formatına dönüştür
    const prompt = messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');

    const result = await genModel.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    const processingTime = Date.now() - startTime;

    return {
      content,
      provider: 'google',
      metadata: {
        model,
        processingTime
      }
    };
  } catch (error) {
    console.error('Google AI API error:', error);
    throw new Error('Google AI API request failed');
  }
}

// Genel LLM çağrısı fonksiyonu
export async function callLLM(
  provider: 'openai' | 'anthropic' | 'google',
  messages: LLMMessage[]
): Promise<LLMResponse> {
  switch (provider) {
    case 'openai':
      return callOpenAI(messages);
    case 'anthropic':
      return callAnthropic(messages);
    case 'google':
      return callGoogle(messages);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

// Doküman analizi için özel fonksiyon
export async function analyzeDocument(
  request: DocumentAnalysisRequest,
  provider: 'openai' | 'anthropic' | 'google' = 'openai'
): Promise<LLMResponse> {
  const { document, analysisType, customPrompt } = request;

  let systemPrompt = '';
  let userPrompt = '';

  switch (analysisType) {
    case 'summary':
      systemPrompt = 'Sen Türkiye hukuk sistemine hakim, deneyimli bir hukuk uzmanısın. Verilen hukuki belgeleri özetleme konusunda uzmansın.';
      userPrompt = `Aşağıdaki ${document.institution} belgesini özetle:

Başlık: ${document.title}
Tarih: ${document.date}
Kurum: ${document.institution}

İçerik:
${document.content}

Lütfen bu belgenin kısa ve anlaşılır bir özetini hazırla. Önemli hukuki noktaları ve sonuçları vurgula.`;
      break;

    case 'legal_analysis':
      systemPrompt = 'Sen Türkiye hukuk sistemine hakim, deneyimli bir hukuk uzmanısın. Hukuki belgeleri derinlemesine analiz edebilirsin.';
      userPrompt = `Aşağıdaki ${document.institution} belgesini hukuki açıdan analiz et:

Başlık: ${document.title}
Tarih: ${document.date}
Kurum: ${document.institution}

İçerik:
${document.content}

Lütfen bu belgenin:
1. Hukuki temellerini
2. Önemli içtihat değerini
3. Pratikte nasıl uygulanacağını
4. Benzer durumlar için emsal değerini
analiz et.`;
      break;

    case 'key_points':
      systemPrompt = 'Sen Türkiye hukuk sistemine hakim, deneyimli bir hukuk uzmanısın. Hukuki belgelerdeki önemli noktaları belirleme konusunda uzmansın.';
      userPrompt = `Aşağıdaki ${document.institution} belgesinin ana başlıklarını ve önemli noktalarını listele:

Başlık: ${document.title}
Tarih: ${document.date}
Kurum: ${document.institution}

İçerik:
${document.content}

Lütfen bu belgenin en önemli noktalarını madde madde listele.`;
      break;

    case 'similar_cases':
      systemPrompt = 'Sen Türkiye hukuk sistemine hakim, deneyimli bir hukuk uzmanısın. Benzer hukuki durumları ve emsal kararları bilirsin.';
      userPrompt = `Aşağıdaki ${document.institution} belgesine benzer durumları ve emsal kararları belirle:

Başlık: ${document.title}
Tarih: ${document.date}
Kurum: ${document.institution}

İçerik:
${document.content}

Bu karara benzer durumlar ve emsal teşkil edebilecek kararlar nelerdir? Hangi koşullarda bu karar örnek alınabilir?`;
      break;

    default:
      throw new Error(`Unsupported analysis type: ${analysisType}`);
  }

  if (customPrompt) {
    userPrompt = customPrompt;
  }

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  return callLLM(provider, messages);
}

// Konuşma geçmişi ile soru-cevap
export async function askQuestionAboutDocument(
  document: { title: string; content: string; institution: string },
  question: string,
  conversationHistory: LLMMessage[] = [],
  provider: 'openai' | 'anthropic' | 'google' = 'openai'
): Promise<LLMResponse> {
  const systemPrompt = `Sen Türkiye hukuk sistemine hakim, deneyimli bir hukuk uzmanısın. 
Kullanıcının sorularını aşağıdaki belge bağlamında yanıtlıyorsun:

Belge Başlığı: ${document.title}
Kurum: ${document.institution}

Belge İçeriği:
${document.content}

Sorulara net, anlaşılır ve hukuki açıdan doğru yanıtlar ver. Gerektiğinde belgeye referans yap.`;

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: question }
  ];

  return callLLM(provider, messages);
}

// API anahtarlarının varlığını kontrol et
export function getAvailableLLMProviders(): string[] {
  const providers: string[] = [];
  
  if (process.env.OPENAI_API_KEY) providers.push('openai');
  if (process.env.ANTHROPIC_API_KEY) providers.push('anthropic');
  if (process.env.GOOGLE_AI_API_KEY) providers.push('google');
  
  return providers;
}