'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Clock, Star, TrendingUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import SearchInterface from '@/components/search/SearchInterface';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import InstitutionCard from '@/components/search/InstitutionCard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useSearch } from '@/hooks/useSearch';
import { INSTITUTIONS } from '@/lib/constants';

export default function SearchPage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>(
    INSTITUTIONS.map(i => i.id) // 🔥 Varsayılan olarak tüm kurumlar seçili
  );
  const [quickFilters, setQuickFilters] = useState({
    timeRange: 'all',
    resultType: 'all',
    sortBy: 'relevance'
  });

  const {
    isLoading,
    results: searchResults,
    totalCount: totalResults,
    searchTime,
    hasMore,
    currentPage,
    search: performSearch,
    loadMore,
    clearResults
  } = useSearch();

  // Local state for query
  const [query, setQuery] = useState('');

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    const institutions = selectedInstitutions.length > 0 ? selectedInstitutions : INSTITUTIONS.map(i => i.id);
    await performSearch(
      searchQuery,
      institutions,
      {
        timeRange: quickFilters.timeRange,
        resultType: quickFilters.resultType,
        sortBy: quickFilters.sortBy
      }
    );
  };

  const handleInstitutionToggle = (institutionId: string) => {
    setSelectedInstitutions(prev => 
      prev.includes(institutionId) 
        ? prev.filter(id => id !== institutionId)
        : [...prev, institutionId]
    );
  };

  const handleSelectAll = () => {
    setSelectedInstitutions(INSTITUTIONS.map(i => i.id));
  };

  const handleClearAll = () => {
    setSelectedInstitutions([]);
  };

  const recentSearches = [
    'anayasa mahkemesi kararları',
    'yargıtay hukuk dairesi',
    'danıştay vergi davaları',
    'emsal kararlar'
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold mb-4">
                🔍 Gelişmiş Arama
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                11 farklı yargı kurumu arasında detaylı arama yapın ve sonuçları analiz edin
              </p>
            </motion.div>

            {/* Search Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <SearchInterface
                query={query}
                onQueryChange={setQuery}
                onSearch={handleSearch}
                isLoading={isLoading}
                placeholder="Örn: anayasa mahkemesi kararları, vergi davası..."
              />
            </motion.div>

            {/* Quick Stats */}
            {searchResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-6 mt-8 text-sm opacity-90"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{totalResults.toLocaleString()} sonuç</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{searchTime}ms</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>{selectedInstitutions.length || INSTITUTIONS.length} kurum</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                
                {/* Institution Selection */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Kurumlar</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSelectAll}
                        className="text-xs"
                      >
                        Tümünü Seç
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearAll}
                        className="text-xs"
                      >
                        Temizle
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {INSTITUTIONS.map(institution => (
                      <InstitutionCard
                        key={institution.id}
                        institution={institution}
                        isSelected={selectedInstitutions.includes(institution.id)}
                        onToggle={() => handleInstitutionToggle(institution.id)}
                        variant="compact"
                      />
                    ))}
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-4 w-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Filtreler</h3>
                  </div>
                  
                  <SearchFilters
                    onFiltersChange={(filters) => {
                      setQuickFilters(filters);
                    }}
                  />
                </div>

                {/* Recent Searches */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Son Aramalar</h3>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search);
                          handleSearch(search);
                        }}
                        className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <Clock className="h-3 w-3 inline mr-2" />
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Search Results */}
            <div className="lg:col-span-3">
              {(!searchResults || searchResults.length === 0) && !isLoading && query.trim() === '' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Arama Yapmaya Başlayın
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Yukarıdaki arama kutusunu kullanarak 11 yargı kurumu arasında arama yapabilirsiniz
                  </p>
                  
                  {/* Quick Search Suggestions */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Anayasa Mahkemesi', 'Yargıtay', 'Danıştay', 'Vergi Davası'].map(suggestion => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setQuery(suggestion);
                          handleSearch(suggestion);
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {((searchResults && searchResults.length > 0) || isLoading) && (
                <SearchResults
                  results={searchResults}
                  isLoading={isLoading}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                  onClearResults={clearResults}
                  totalResults={totalResults}
                  searchTime={searchTime}
                  currentPage={currentPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}