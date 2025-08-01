'use client';

import { motion } from "framer-motion";
import { Building2, Calendar, FileText, ExternalLink } from "lucide-react";
import Button from "../ui/Button";

interface Institution {
  id: string;
  name: string;
  description: string;
  icon: string;
  totalDocuments: number;
  lastUpdate: string;
  status: string;
}

interface InstitutionCardProps {
  institution?: Institution;
  name?: string;
  description?: string;
  icon?: React.ReactNode;
  totalDocuments?: number;
  lastUpdate?: string;
  isSelected: boolean;
  onSelect?: () => void;
  onToggle?: () => void;
  variant?: 'default' | 'compact';
}

export default function InstitutionCard({
  institution,
  name,
  description,
  icon,
  totalDocuments,
  lastUpdate,
  isSelected,
  onSelect,
  onToggle,
  variant = 'default'
}: InstitutionCardProps) {
  // Use institution object props if provided, otherwise use individual props
  const displayName = institution?.name || name || '';
  const displayDescription = institution?.description || description || '';
  const displayIcon = institution?.icon || icon;
  const displayTotalDocuments = institution?.totalDocuments || totalDocuments || 0;
  const displayLastUpdate = institution?.lastUpdate || lastUpdate || '';
  
  const handleClick = () => {
    if (onToggle) {
      onToggle();
    } else if (onSelect) {
      onSelect();
    }
  };
  // Compact variant için farklı stil
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
          isSelected
            ? 'border-blue-500 bg-blue-50 text-blue-900'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
        onClick={handleClick}
      >
        {/* ✅ Her kurum için Checkbox */}
        <div className="flex-shrink-0">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            isSelected 
              ? 'border-blue-500 bg-blue-500' 
              : 'border-gray-300 bg-white hover:border-blue-400'
          }`}>
            {isSelected && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        
        {/* Kurum İkonu */}
        <div className="flex-shrink-0">
          <span className="text-lg">{displayIcon}</span>
        </div>
        
        {/* Kurum Bilgileri */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${
            isSelected ? 'text-blue-900' : 'text-gray-900'
          }`}>
            {displayName}
          </p>
          <p className={`text-xs truncate ${
            isSelected ? 'text-blue-700' : 'text-gray-500'
          }`}>
            {displayTotalDocuments.toLocaleString()} döküman
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative p-6 rounded-xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onClick={handleClick}
    >
      {/* Seçim Göstergesi */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900" />
      )}

      {/* Kurum İkonu */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
        isSelected 
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400'
          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
      }`}>
        <span className="text-2xl">{displayIcon}</span>
      </div>

      {/* Kurum Bilgileri */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
            {displayName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {displayDescription}
          </p>
        </div>

        {/* İstatistikler */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <FileText className="w-4 h-4" />
            <span>{displayTotalDocuments.toLocaleString('tr-TR')} belge</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{displayLastUpdate}</span>
          </div>
        </div>

        {/* Hızlı Arama Butonu */}
        <Button
          variant={isSelected ? "primary" : "secondary"}
          size="sm"
          className="w-full"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {isSelected ? 'Seçildi' : 'Seç'}
        </Button>
      </div>
    </motion.div>
  );
}