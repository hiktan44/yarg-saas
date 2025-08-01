'use client';

import { useState } from 'react';
import { Building2, MessageCircle } from 'lucide-react';
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
    analyzeDocumentAI, 
    messages: aiHookMessages, 
    isLoading: aiLoading,
    clearConversation 
  } = useAI();

  // Mock kurumlar (gerçek API'den gelinceye kadar)
  const institutions = [
    { id: 'yargitay', name: 'Yargıtay', description: 'Temyiz mahkemesi kararları', totalDocuments: 125000, lastUpdate: '2024-01-15' },
    { id: 'danistay', name: 'Danıştay', description: 'İdari yargı kararları', totalDocuments: 89000, lastUpdate: '2024-01-14' },
    { id: 'emsal', name: 'Emsal (UYAP)', description: 'Emsal karar sistemi', totalDocuments: 256000, lastUpdate: '2024-01-16' },
    { id: 'bedesten', name: 'Bedesten', description: 'Adalet Bakanlığı kararları', totalDocuments: 67000, lastUpdate: '2024-01-13' },
    { id: 'kvkk', name: 'KVKK', description: 'Veri koruma kararları', totalDocuments: 1200, lastUpdate: '2024-01-16' },
    { id: 'bddk', name: 'BDDK', description: 'Bankacılık kararları', totalDocuments: 5600, lastUpdate: '2024-01-12' }
  ];

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
      : institutions.map(i => i.id);
    
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

  const handleAIMessage = async (message: string, provider: string) => {
    if (!selectedDocument) return;

    // Mock AI message oluştur
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    const assistantMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Bu ${selectedDocument.institution} belgesine göre: ${message} sorunuza yanıt vermek için dokümanı analiz ediyorum. Bu örnek bir AI yanıtıdır.`,
      timestamp: new Date(),
      llmProvider: provider as any,
      metadata: {
        documentTitle: selectedDocument.title,
        processingTime: 1500,
        tokenCount: 150
      }
    };

    setAiMessages(prev => [...prev, userMessage, assistantMessage]);
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
              {institutions.map((institution) => (
                <InstitutionCard
                  key={institution.id}
                  name={institution.name}
                  description={institution.description}
                  icon={<Building2 className="w-6 h-6" />}
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
                  availableInstitutions={institutions.map(i => i.name)}
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
                        {selectedInstitutions.length || institutions.length}
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
      <AIPanel
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        selectedDocument={selectedDocument ? {
          id: selectedDocument.id,
          title: selectedDocument.title,
          content: selectedDocument.content,
          institution: selectedDocument.institution
        } : undefined}
        messages={aiMessages}
        onSendMessage={handleAIMessage}
        isLoading={aiLoading}
      />
      </div>
    </ProtectedRoute>
  );
}