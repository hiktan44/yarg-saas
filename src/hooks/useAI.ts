'use client';

import { useState, useCallback } from 'react';
import { callLLM, analyzeDocument, askQuestionAboutDocument, LLMMessage, LLMResponse, DocumentAnalysisRequest } from '@/lib/api/llm';

interface UseAIOptions {
  defaultProvider?: 'openai' | 'anthropic' | 'google';
}

export function useAI(options: UseAIOptions = {}) {
  const { defaultProvider = 'openai' } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<LLMMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentProvider, setCurrentProvider] = useState(defaultProvider);

  const sendMessage = useCallback(async (
    content: string,
    provider: 'openai' | 'anthropic' | 'google' = currentProvider
  ) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);

    // Kullanıcı mesajını ekle
    const userMessage: LLMMessage = {
      role: 'user',
      content: content.trim()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await callLLM(provider, [...messages, userMessage]);
      
      // AI yanıtını ekle
      const assistantMessage: LLMMessage = {
        role: 'assistant',
        content: response.content
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      return response;
    } catch (err) {
      console.error('AI request error:', err);
      setError(err instanceof Error ? err.message : 'AI yanıt alınırken hata oluştu');
      
      // Hata mesajını geri al
      setMessages(prev => prev.slice(0, -1));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentProvider]);

  const analyzeDocumentAI = useCallback(async (
    request: DocumentAnalysisRequest,
    provider: 'openai' | 'anthropic' | 'google' = currentProvider
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzeDocument(request, provider);
      
      // Analiz sonucunu mesajlara ekle
      const analysisMessage: LLMMessage = {
        role: 'assistant',
        content: response.content
      };

      setMessages(prev => [...prev, analysisMessage]);
      
      return response;
    } catch (err) {
      console.error('Document analysis error:', err);
      setError(err instanceof Error ? err.message : 'Doküman analizi sırasında hata oluştu');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentProvider]);

  const askQuestion = useCallback(async (
    document: { title: string; content: string; institution: string },
    question: string,
    provider: 'openai' | 'anthropic' | 'google' = currentProvider
  ) => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);

    // Soru mesajını ekle
    const questionMessage: LLMMessage = {
      role: 'user',
      content: question.trim()
    };

    setMessages(prev => [...prev, questionMessage]);

    try {
      const response = await askQuestionAboutDocument(
        document,
        question,
        messages,
        provider
      );
      
      // Yanıt mesajını ekle
      const answerMessage: LLMMessage = {
        role: 'assistant',
        content: response.content
      };

      setMessages(prev => [...prev, answerMessage]);
      
      return response;
    } catch (err) {
      console.error('Question answering error:', err);
      setError(err instanceof Error ? err.message : 'Soru yanıtlanırken hata oluştu');
      
      // Hata durumunda soruyu geri al
      setMessages(prev => prev.slice(0, -1));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentProvider]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const changeProvider = useCallback((provider: 'openai' | 'anthropic' | 'google') => {
    setCurrentProvider(provider);
    setError(null);
  }, []);

  const removeMessage = useCallback((index: number) => {
    setMessages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const retryLastMessage = useCallback(async () => {
    if (messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') return;
    
    // Son kullanıcı mesajını tekrar gönder
    setMessages(prev => prev.slice(0, -1));
    await sendMessage(lastMessage.content, currentProvider);
  }, [messages, sendMessage, currentProvider]);

  return {
    // State
    isLoading,
    messages,
    error,
    currentProvider,
    
    // Actions
    sendMessage,
    analyzeDocumentAI,
    askQuestion,
    clearConversation,
    changeProvider,
    removeMessage,
    retryLastMessage
  };
}