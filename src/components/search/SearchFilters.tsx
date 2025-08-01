'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Filter, 
  Building2, 
  ChevronDown, 
  X,
  Search,
  Clock
} from "lucide-react";
import Button from "../ui/Button";

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  availableInstitutions: string[];
  availableDepartments: string[];
}

export interface SearchFilters {
  institutions: string[];
  departments: string[];
  dateRange: {
    start: string;
    end: string;
  };
  documentType: string;
  sortBy: 'date' | 'relevance';
  sortOrder: 'asc' | 'desc';
}

export default function SearchFilters({
  onFiltersChange,
  availableInstitutions,
  availableDepartments
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    institutions: [],
    departments: [],
    dateRange: {
      start: '',
      end: ''
    },
    documentType: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      institutions: [],
      departments: [],
      dateRange: { start: '', end: '' },
      documentType: 'all',
      sortBy: 'date',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFiltersCount = 
    filters.institutions.length + 
    filters.departments.length + 
    (filters.dateRange.start ? 1 : 0) + 
    (filters.documentType !== 'all' ? 1 : 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Filter Başlığı */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-900 dark:text-white">
            Gelişmiş Filtreler
          </span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
                          onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              clearFilters();
            }}
            >
              Temizle
            </Button>
          )}
          <ChevronDown 
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </div>

      {/* Filter İçeriği */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {/* Kurum Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Building2 className="w-4 h-4 inline mr-1" />
                  Kurumlar
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableInstitutions.map((institution) => (
                    <label key={institution} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.institutions.includes(institution)}
                        onChange={(e) => {
                          const institutions = e.target.checked
                            ? [...filters.institutions, institution]
                            : filters.institutions.filter(i => i !== institution);
                          updateFilters({ institutions });
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {institution}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tarih Aralığı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Tarih Aralığı
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Başlangıç</label>
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => updateFilters({
                        dateRange: { ...filters.dateRange, start: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Bitiş</label>
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => updateFilters({
                        dateRange: { ...filters.dateRange, end: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Sıralama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Sıralama
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilters({ sortBy: e.target.value as 'date' | 'relevance' })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="date">Tarihe Göre</option>
                    <option value="relevance">İlişkiye Göre</option>
                  </select>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => updateFilters({ sortOrder: e.target.value as 'asc' | 'desc' })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="desc">Yeniden Eskiye</option>
                    <option value="asc">Eskiden Yeniye</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}