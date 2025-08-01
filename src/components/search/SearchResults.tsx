'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Calendar, 
  Building2, 
  ExternalLink, 
  ChevronRight,
  BookOpen,
  Clock,
  Gavel,
  Star,
  Download
} from "lucide-react";
import Button from "../ui/Button";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export interface SearchResult {
  id: string;
  title: string;
  institution: string;
  department?: string;
  date: string;
  summary: string;
  content?: string;
  documentType: string;
  url?: string;
  relevanceScore: number;
  isBookmarked?: boolean;
  metadata?: {
    caseNumber?: string;
    decisionNumber?: string;
    keywords?: string[];
  };
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  onDocumentSelect: (document: SearchResult) => void;
  onBookmarkToggle: (documentId: string) => void;
}

const institutionIcons: Record<string, React.ReactNode> = {
  'Yargıtay': <Gavel className="w-4 h-4" />,
  'Danıştay': <Building2 className="w-4 h-4" />,
  'Emsal': <FileText className="w-4 h-4" />,
  'Bedesten': <BookOpen className="w-4 h-4" />,
  'KVKK': <Star className="w-4 h-4" />,
  'BDDK': <Building2 className="w-4 h-4" />,
  'default': <FileText className="w-4 h-4" />
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

export default function SearchResults({
  results,
  isLoading,
  onDocumentSelect,
  onBookmarkToggle
}: SearchResultsProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Sonuç Bulunamadı
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Arama kriterlerinizi değiştirerek tekrar deneyin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Arama Sonuçları
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {results.length.toLocaleString('tr-TR')} sonuç bulundu
        </span>
      </div>

      <AnimatePresence>
        {results.map((result, index) => {
          const isExpanded = expandedItems.has(result.id);
          const institutionColor = institutionColors[result.institution] || institutionColors.default;
          const institutionIcon = institutionIcons[result.institution] || institutionIcons.default;

          return (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Başlık ve Kurum */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${institutionColor}`}>
                        {institutionIcon}
                        {result.institution}
                      </span>
                      {result.department && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {result.department}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {result.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(result.date), 'dd MMMM yyyy', { locale: tr })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{result.documentType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Aksiyonlar */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onBookmarkToggle(result.id)}
                      className={result.isBookmarked ? 'text-yellow-500' : ''}
                    >
                      <Star className={`w-4 h-4 ${result.isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                    {result.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(result.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Özet */}
                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {result.summary}
                  </p>
                </div>

                {/* Genişletilmiş İçerik */}
                <AnimatePresence>
                  {isExpanded && result.content && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4"
                    >
                      <div className="prose dark:prose-invert max-w-none text-sm">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {result.content.substring(0, 500)}...
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Alt Butonlar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(result.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {isExpanded ? 'Daha Az' : 'Devamını Oku'}
                      <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onDocumentSelect(result)}
                    >
                      <BookOpen className="w-4 h-4 mr-1" />
                      AI Analizi
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onDocumentSelect(result)}
                    >
                      Detayları Gör
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}