'use client';

import { motion } from "framer-motion";
import { Building2, Calendar, FileText, ExternalLink } from "lucide-react";
import Button from "../ui/Button";

interface InstitutionCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  totalDocuments: number;
  lastUpdate: string;
  isSelected: boolean;
  onSelect: () => void;
}

export default function InstitutionCard({
  name,
  description,
  icon,
  totalDocuments,
  lastUpdate,
  isSelected,
  onSelect
}: InstitutionCardProps) {
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
      onClick={onSelect}
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
        {icon}
      </div>

      {/* Kurum Bilgileri */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>

        {/* İstatistikler */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <FileText className="w-4 h-4" />
            <span>{totalDocuments.toLocaleString('tr-TR')} belge</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{lastUpdate}</span>
          </div>
        </div>

        {/* Hızlı Arama Butonu */}
        <Button
          variant={isSelected ? "primary" : "secondary"}
          size="sm"
          className="w-full"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isSelected ? 'Seçildi' : 'Seç'}
        </Button>
      </div>
    </motion.div>
  );
}