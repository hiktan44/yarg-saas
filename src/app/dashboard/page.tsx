'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import SearchInterface from '@/components/search/SearchInterface';
import InstitutionCard from '@/components/search/InstitutionCard';
import SearchFilters, { SearchFilters as SearchFiltersType } from '@/components/search/SearchFilters';
import SearchResults, { SearchResult } from '@/components/search/SearchResults';
import DocumentDetailPanel, { DocumentDetail } from '@/components/search/DocumentDetailPanel';
import AIPanel, { AIMessage } from '@/components/ai/AIPanel';
import Button from '@/components/ui/Button';
import { useSearch } from '@/hooks/useSearch';
import { useAI } from '@/hooks/useAI';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { INSTITUTIONS } from '@/lib/constants';

export default function DashboardPage() {
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFiltersType>({
    institutions: [],
    departments: [],
    dateRange: { start: '', end: '' },
    documentType: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [selectedDocument, setSelectedDocument] = useState<DocumentDetail | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);

  // Hooks
  const { search, results, isLoading, totalCount, searchTime } = useSearch();
  const { 
    askQuestion, 
    analyzeDocument, 
    messages: aiHookMessages, 
    isLoading: aiLoading,
    clearConversation,
    changeProvider,
    error: aiError
  } = useAI();



  const handleInstitutionSelect = (institutionId: string) => {
    setSelectedInstitutions(prev => 
      prev.includes(institutionId)
        ? prev.filter(id => id !== institutionId)
        : [...prev, institutionId]
    );
  };

  const handleSearch = (query: string) => {
        const activeInstitutions = selectedInstitutions.length > 0
      ? selectedInstitutions
      : INSTITUTIONS.map(i => i.id);
    
    search(query, activeInstitutions, searchFilters);
  };

  const handleDocumentSelect = (result: SearchResult) => {
    const documentDetail: DocumentDetail = {
      id: result.id,
      title: result.title,
      institution: result.institution,
      department: result.department,
      date: result.date,
      content: result.content || 'İçerik yükleniyor...',
      summary: result.summary,
      documentType: result.documentType,
      url: result.url,
      isBookmarked: result.isBookmarked,
      caseNumber: result.metadata?.caseNumber,
      keywords: result.metadata?.keywords
    };
    
    setSelectedDocument(documentDetail);
    setIsDetailPanelOpen(true);
  };

  const handleAIAnalyze = (document: DocumentDetail) => {
    setSelectedDocument(document);
    setIsDetailPanelOpen(false);
    setIsAIPanelOpen(true);
    clearConversation();
  };

  // 🤖 REAL AI Integration - Question Handling
  const handleAIMessage = async (message: string, provider: string) => {
    if (!selectedDocument) return;

    try {
      await askQuestion(
        {
          title: selectedDocument.title,
          content: selectedDocument.content || selectedDocument.summary,
          institution: selectedDocument.institution
        },
        message,
        provider as 'openai' | 'anthropic' | 'google'
      );
    } catch (error) {
      console.error('AI Question Error:', error);
      // Error handling - useAI hook'u hata durumunu manage ediyor
    }
  };

  // 📄 Real AI Document Analysis
  const handleQuickAnalysis = async (analysisType: 'summary' | 'legal_analysis' | 'key_points' | 'similar_cases') => {
    if (!selectedDocument) return;

    try {
      await analyzeDocument(
        {
          title: selectedDocument.title,
          content: selectedDocument.content || selectedDocument.summary,
          institution: selectedDocument.institution,
          date: selectedDocument.date
        },
        analysisType
      );
    } catch (error) {
      console.error('AI Analysis Error:', error);
    }
  };

  const handleBookmarkToggle = async (documentId: string) => {
    // Bookmark toggle logic burada implement edilecek
    console.log('Bookmark toggled for:', documentId);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Yargı Arama Sistemi
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            11 farklı hukuk kurumunda arama yapın ve AI ile analiz edin
          </p>
        </div>

        {/* Ana İçerik */}
        <div className="space-y-8">
          {/* Kurum Seçimi */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Arama Yapılacak Kurumlar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {INSTITUTIONS.map((institution) => (
                <InstitutionCard
                  key={institution.id}
                  name={institution.name}
                  description={institution.description}
                  icon={institution.icon}
                  totalDocuments={institution.totalDocuments}
                  lastUpdate={institution.lastUpdate}
                  isSelected={selectedInstitutions.includes(institution.id)}
                  onSelect={() => handleInstitutionSelect(institution.id)}
                />
              ))}
            </div>
          </div>

          {/* Arama Arayüzü */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Ana Arama */}
            <div className="lg:col-span-3">
              <SearchInterface onSearch={handleSearch} />
              
              {/* Filtreler */}
              <div className="mt-6">
                <SearchFilters
                  onFiltersChange={setSearchFilters}
                  availableInstitutions={INSTITUTIONS.map(i => i.name)}
                  availableDepartments={['1. Daire', '2. Daire', '3. Daire', 'Genel Kurul']}
                />
              </div>

              {/* Sonuçlar */}
              <div className="mt-8">
                <SearchResults
                  results={results}
                  isLoading={isLoading}
                  onDocumentSelect={handleDocumentSelect}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              </div>
            </div>

            {/* Yan Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Arama İstatistikleri
                </h2>
                
                {totalCount > 0 && (
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Toplam Sonuç:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {totalCount.toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Arama Süresi:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {searchTime}ms
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Seçilen Kurum:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedInstitutions.length || INSTITUTIONS.length}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={() => setIsAIPanelOpen(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    AI Sohbetini Aç
                  </Button>
                  
                  <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="font-medium text-gray-900 dark:text-white">Son Aramalar</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Arama geçmişinizi görün</div>
                  </button>
                  
                  <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="font-medium text-gray-900 dark:text-white">Kayıtlı Belgeler</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Favori belgeleriniz</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detay Paneli */}
      <DocumentDetailPanel
        document={selectedDocument}
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
        onBookmarkToggle={handleBookmarkToggle}
        onAIAnalyze={handleAIAnalyze}
      />

      {/* AI Paneli */}
      {/* 🤖 Real AI Panel */}
      <AIPanel
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        selectedDocument={selectedDocument ? {
          id: selectedDocument.id,
          title: selectedDocument.title,
          content: selectedDocument.content || selectedDocument.summary,
          institution: selectedDocument.institution
        } : undefined}
        messages={aiHookMessages} // Real AI messages from hook
        onSendMessage={handleAIMessage}
        isLoading={aiLoading}
      />

      {/* Quick Analysis Buttons */}
      {selectedDocument && isAIPanelOpen && (
        <div className="fixed bottom-20 right-[33rem] z-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 space-y-2">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hızlı Analiz
            </p>
            <div className="flex flex-col gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleQuickAnalysis('summary')}
                disabled={aiLoading}
              >
                📄 Özet
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleQuickAnalysis('legal_analysis')}
                disabled={aiLoading}
              >
                ⚖️ Hukuki Analiz
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleQuickAnalysis('key_points')}
                disabled={aiLoading}
              >
                🔑 Ana Noktalar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleQuickAnalysis('similar_cases')}
                disabled={aiLoading}
              >
                📚 Benzer Davalar
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}