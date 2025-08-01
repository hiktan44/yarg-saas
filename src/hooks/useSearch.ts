'use client';

import { useState, useCallback, useEffect } from 'react';
import { searchDocuments, SearchRequest, SearchResponse, DocumentResult } from '@/lib/api/institutions';
import { useSupabase } from '@/lib/supabase';

interface UseSearchOptions {
  autoSearch?: boolean;
  debounceMs?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { autoSearch = false, debounceMs = 300 } = options;
  const { supabase, user } = useSupabase();
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DocumentResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTime, setSearchTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search function
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const search = useCallback(async (
    query: string,
    institutions: string[] = [],
    filters: SearchRequest['filters'] = {},
    page: number = 1,
    append: boolean = false
  ) => {
    if (!query.trim()) {
      setResults([]);
      setTotalCount(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchRequest: SearchRequest = {
        query: query.trim(),
        institutions,
        filters,
        pagination: {
          page,
          limit: 20
        },
        sortBy: 'date',
        sortOrder: 'desc'
      };

      const response: SearchResponse = await searchDocuments(searchRequest);

      if (append) {
        setResults(prev => [...prev, ...response.results]);
      } else {
        setResults(response.results);
      }

      setTotalCount(response.totalCount);
      setSearchTime(response.searchTime);
      setHasMore(response.hasMore);
      setCurrentPage(page);

      // Arama geçmişini kaydet
      if (user && supabase) {
        try {
          await supabase
            .from('search_history')
            .insert({
              user_id: user.id,
              query: query.trim(),
              institutions: institutions.length > 0 ? institutions : null,
              filters: Object.keys(filters).length > 0 ? filters : null,
              results_count: response.totalCount,
              search_time_ms: response.searchTime
            });
        } catch (historyError: any) {
          // Suppress 401 auth errors for non-authenticated users (normal behavior)
          if (historyError?.status !== 401) {
            console.warn('Failed to save search history:', historyError);
          }
        }
      }

    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Arama sırasında bir hata oluştu');
      setResults([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  const debouncedSearch = useCallback((
    query: string,
    institutions: string[] = [],
    filters: SearchRequest['filters'] = {}
  ) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      search(query, institutions, filters, 1, false);
    }, debounceMs);

    setDebounceTimer(timer);
  }, [search, debounceMs, debounceTimer]);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      // Son arama parametrelerini tekrar kullan
      // Bu basit implementation'da bu bilgileri state'te tutmuyoruz
      // Gerçek uygulamada son search parametrelerini saklamalıyız
    }
  }, [hasMore, isLoading]);

  const clearResults = useCallback(() => {
    setResults([]);
    setTotalCount(0);
    setError(null);
    setHasMore(false);
    setCurrentPage(1);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return {
    // State
    isLoading,
    results,
    totalCount,
    searchTime,
    error,
    hasMore,
    currentPage,
    
    // Actions
    search,
    debouncedSearch,
    loadMore,
    clearResults
  };
}