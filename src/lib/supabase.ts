import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

// Supabase istemcisini oluştur
export const supabase = createClientComponentClient();

// Custom hook - Supabase kimlik doğrulama
export function useSupabase() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mevcut kullanıcıyı al
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Auth değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: any, session: any) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    supabase,
    user,
    loading
  };
}

// Yardımcı fonksiyonlar
export const authHelpers = {
  // Google ile giriş yap
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { data, error };
  },

  // Email/şifre ile giriş yap
  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Email/şifre ile kayıt ol
  signUpWithEmail: async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  },

  // Çıkış yap
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Şifre sıfırlama
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    return { data, error };
  }
};

// Database yardımcı fonksiyonları
export const dbHelpers = {
  // Arama geçmişi kaydet
  saveSearchHistory: async (userId: string, searchData: {
    query: string;
    institutions?: string[];
    filters?: any;
    resultsCount: number;
    searchTimeMs: number;
  }) => {
    const { data, error } = await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        query: searchData.query,
        institutions: searchData.institutions,
        filters: searchData.filters,
        results_count: searchData.resultsCount,
        search_time_ms: searchData.searchTimeMs
      });
    
    return { data, error };
  },

  // Belge kaydet
  saveDocument: async (userId: string, documentData: {
    documentId: string;
    title: string;
    institution: string;
    summary?: string;
    documentUrl?: string;
    metadata?: any;
  }) => {
    const { data, error } = await supabase
      .from('saved_documents')
      .insert({
        user_id: userId,
        document_id: documentData.documentId,
        title: documentData.title,
        institution: documentData.institution,
        summary: documentData.summary,
        document_url: documentData.documentUrl,
        metadata: documentData.metadata
      });
    
    return { data, error };
  },

  // LLM konuşması kaydet
  saveLLMConversation: async (userId: string, conversationData: {
    documentId?: string;
    llmProvider: string;
    messages: any[];
    metadata?: any;
  }) => {
    const { data, error } = await supabase
      .from('llm_conversations')
      .insert({
        user_id: userId,
        document_id: conversationData.documentId,
        llm_provider: conversationData.llmProvider,
        messages: conversationData.messages,
        metadata: conversationData.metadata
      });
    
    return { data, error };
  },

  // Kullanıcının arama geçmişini getir
  getUserSearchHistory: async (userId: string, limit: number = 50) => {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  // Kullanıcının kayıtlı belgelerini getir
  getUserSavedDocuments: async (userId: string) => {
    const { data, error } = await supabase
      .from('saved_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Kullanıcının LLM konuşmalarını getir
  getUserLLMConversations: async (userId: string, limit: number = 20) => {
    const { data, error } = await supabase
      .from('llm_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  }
};