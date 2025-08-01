'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';

// 🔄 LLM Types (client-side)
export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  llmProvider?: 'openai' | 'anthropic' | 'google';
  metadata?: {
    documentTitle?: string;
    processingTime?: number;
    tokenCount?: number;
  };
}

interface UseAIOptions {
  defaultProvider?: 'openai' | 'anthropic' | 'google';
}

export function useAI(options: UseAIOptions = {}) {
  const { defaultProvider = 'openai' } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentProvider, setCurrentProvider] = useState(defaultProvider);

  // 🤖 Ask question about document (API route)
  const askQuestion = useCallback(async (
    document: { title: string; content: string; institution: string },
    question: string,
    provider: 'openai' | 'anthropic' | 'google' = currentProvider
  ) => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question.trim(),
      timestamp: new Date(),
      llmProvider: provider,
      metadata: {
        documentTitle: document.title
      }
    };

    setAiMessages(prev => [...prev, userMessage]);

    try {
      const response = await axios.post('/api/ai/chat', {
        document,
        question: question.trim(),
        conversationHistory: aiMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        provider
      });

      if (response.data.success) {
        // Add AI response
        const assistantMessage: AIMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date(),
          llmProvider: provider,
          metadata: {
            documentTitle: document.title,
            processingTime: response.data.metadata?.processingTime,
            tokenCount: response.data.metadata?.tokenCount
          }
        };

        setAiMessages(prev => [...prev, assistantMessage]);
        return response.data;
      } else {
        throw new Error(response.data.error || 'AI response failed');
      }
    } catch (err: any) {
      console.error('AI Chat error:', err);
      setError(err.response?.data?.error || err.message || 'Soru yanıtlanırken hata oluştu');
      
      // Remove user message on error
      setAiMessages(prev => prev.slice(0, -1));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [aiMessages, currentProvider]);

  // 📄 Analyze document (API route)
  const analyzeDocument = useCallback(async (
    document: { title: string; content: string; institution: string; date: string },
    analysisType: 'summary' | 'legal_analysis' | 'key_points' | 'similar_cases',
    provider: 'openai' | 'anthropic' | 'google' = currentProvider,
    customPrompt?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/ai/analyze', {
        document,
        analysisType,
        customPrompt,
        provider
      });

      if (response.data.success) {
        // Add analysis result to messages
        const analysisMessage: AIMessage = {
          id: `analysis-${Date.now()}`,
          role: 'assistant',
          content: response.data.analysis,
          timestamp: new Date(),
          llmProvider: provider,
          metadata: {
            documentTitle: document.title,
            processingTime: response.data.metadata?.processingTime,
            tokenCount: response.data.metadata?.tokenCount
          }
        };

        setAiMessages(prev => [...prev, analysisMessage]);
        return response.data;
      } else {
        throw new Error(response.data.error || 'Analysis failed');
      }
    } catch (err: any) {
      console.error('Document analysis error:', err);
      setError(err.response?.data?.error || err.message || 'Doküman analizi sırasında hata oluştu');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentProvider]);

  // 🔧 Utility functions
  const clearConversation = useCallback(() => {
    setAiMessages([]);
    setError(null);
  }, []);

  const changeProvider = useCallback((provider: 'openai' | 'anthropic' | 'google') => {
    setCurrentProvider(provider);
    setError(null);
  }, []);

  const removeMessage = useCallback((messageId: string) => {
    setAiMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  const retryLastMessage = useCallback(async (
    document: { title: string; content: string; institution: string }
  ) => {
    if (aiMessages.length === 0) return;
    
    const lastMessage = aiMessages[aiMessages.length - 1];
    if (lastMessage.role !== 'user') return;
    
    // Remove last message and retry
    setAiMessages(prev => prev.slice(0, -1));
    await askQuestion(document, lastMessage.content, currentProvider);
  }, [aiMessages, askQuestion, currentProvider]);

  // 🌐 Get available AI providers
  const getAvailableProviders = useCallback(async () => {
    try {
      const response = await axios.get('/api/ai/analyze');
      return response.data.supportedProviders || [];
    } catch (err) {
      console.error('Error fetching providers:', err);
      return [];
    }
  }, []);

  return {
    // State
    isLoading,
    messages: aiMessages,
    error,
    currentProvider,
    
    // Actions
    askQuestion,
    analyzeDocument,
    clearConversation,
    changeProvider,
    removeMessage,
    retryLastMessage,
    getAvailableProviders
  };
}