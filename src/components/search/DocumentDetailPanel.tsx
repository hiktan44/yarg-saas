'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FileText, 
  Calendar, 
  Building2, 
  ExternalLink, 
  Download, 
  Share2, 
  BookOpen,
  Star,
  Eye,
  Clock,
  Gavel,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';
import Button from '../ui/Button';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export interface DocumentDetail {
  id: string;
  title: string;
  institution: string;
  department?: string;
  date: string;
  content: string;
  summary: string;
  documentType: string;
  caseNumber?: string;
  decisionNumber?: string;
  url?: string;
  relatedCases?: string[];
  legalReferences?: string[];
  keywords?: string[];
  isBookmarked?: boolean;
  viewCount?: number;
}

interface DocumentDetailPanelProps {
  document: DocumentDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onBookmarkToggle: (documentId: string) => void;
  onAIAnalyze: (document: DocumentDetail) => void;
}

export default function DocumentDetailPanel({
  document,
  isOpen,
  onClose,
  onBookmarkToggle,
  onAIAnalyze
}: DocumentDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'summary' | 'references'>('summary');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const handleCopyUrl = () => {
    const url = document.url || window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: document.summary,
          url: document.url || window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopyUrl();
    }
  };

  const institutionColors: Record<string, string> = {
    'Yargıtay': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Danıştay': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Emsal': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Bedesten': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'KVKK': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'BDDK': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'default': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  };

  const tabs = [
    { id: 'summary', label: 'Özet', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'content', label: 'Tam Metin', icon: <FileText className="w-4 h-4" /> },
    { id: 'references', label: 'Referanslar', icon: <AlertCircle className="w-4 h-4" /> }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Gavel className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Doküman Detayları
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {document.institution}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Meta Bilgiler */}
              <div className="px-6 pb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    institutionColors[document.institution] || institutionColors.default
                  }`}>
                    <Building2 className="w-4 h-4" />
                    {document.institution}
                  </span>
                  {document.department && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {document.department}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(document.date), 'dd MMMM yyyy', { locale: tr })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{document.documentType}</span>
                  </div>
                  {document.caseNumber && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FileText className="w-4 h-4" />
                      <span>Dava No: {document.caseNumber}</span>
                    </div>
                  )}
                  {document.viewCount && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Eye className="w-4 h-4" />
                      <span>{document.viewCount.toLocaleString('tr-TR')} görüntülenme</span>
                    </div>
                  )}
                </div>

                {/* Başlık */}
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  {document.title}
                </h1>

                {/* Aksiyonlar */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="primary"
                    onClick={() => onAIAnalyze(document)}
                    className="flex-1"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    AI Analizi
                  </Button>
                  <Button
                    variant={document.isBookmarked ? "primary" : "secondary"}
                    onClick={() => onBookmarkToggle(document.id)}
                  >
                    <Star className={`w-4 h-4 ${document.isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleShare}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  </Button>
                  {document.url && (
                    <Button
                      variant="secondary"
                      onClick={() => window.open(document.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto p-6">
                {activeTab === 'summary' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Doküman Özeti
                      </h3>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {document.summary}
                        </p>
                      </div>
                    </div>

                    {document.keywords && document.keywords.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Anahtar Kelimeler
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {document.keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Tam Metin
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Daralt
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Genişlet
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className={`prose dark:prose-invert max-w-none ${
                      isExpanded ? '' : 'max-h-96 overflow-hidden relative'
                    }`}>
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {document.content}
                      </div>
                      {!isExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'references' && (
                  <div className="space-y-6">
                    {document.relatedCases && document.relatedCases.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          İlgili Davalar
                        </h4>
                        <div className="space-y-2">
                          {document.relatedCases.map((caseRef, index) => (
                            <div
                              key={index}
                              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {caseRef}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {document.legalReferences && document.legalReferences.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          Hukuki Referanslar
                        </h4>
                        <div className="space-y-2">
                          {document.legalReferences.map((ref, index) => (
                            <div
                              key={index}
                              className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                            >
                              <span className="text-sm text-blue-800 dark:text-blue-200">
                                {ref}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!document.relatedCases || document.relatedCases.length === 0) &&
                     (!document.legalReferences || document.legalReferences.length === 0) && (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Bu doküman için referans bilgisi bulunmamaktadır.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}