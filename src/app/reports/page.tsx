'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Calendar,
  Download,
  Filter,
  Clock,
  Users,
  Search,
  Eye,
  BookOpen,
  Target
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { INSTITUTIONS } from '@/lib/constants';

export default function ReportsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([]);
  const [reportType, setReportType] = useState('overview');

  // Sample data - gerçek uygulamada API'den gelecek
  const stats = {
    totalSearches: 12487,
    totalDocuments: 2847293,
    activeUsers: 1247,
    avgResponseTime: 342,
    topKeywords: [
      { keyword: 'anayasa mahkemesi', count: 1247 },
      { keyword: 'vergi davası', count: 892 },
      { keyword: 'yargıtay kararı', count: 734 },
      { keyword: 'danıştay', count: 621 },
      { keyword: 'emsal karar', count: 543 }
    ],
    institutionStats: INSTITUTIONS.map(inst => ({
      id: inst.id,
      name: inst.name,
      searches: Math.floor(Math.random() * 1000) + 100,
      documents: inst.totalDocuments,
      responseTime: Math.floor(Math.random() * 200) + 150
    })),
    weeklyTrend: [
      { day: 'Pzt', searches: 1247 },
      { day: 'Sal', searches: 1432 },
      { day: 'Çar', searches: 1789 },
      { day: 'Per', searches: 1654 },
      { day: 'Cum', searches: 2143 },
      { day: 'Cmt', searches: 892 },
      { day: 'Paz', searches: 567 }
    ]
  };

  const reportCards = [
    {
      title: 'Toplam Arama',
      value: stats.totalSearches.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive',
      icon: Search,
      color: 'blue'
    },
    {
      title: 'Toplam Döküman',
      value: stats.totalDocuments.toLocaleString(),
      change: '+2.3%',
      changeType: 'positive',
      icon: FileText,
      color: 'green'
    },
    {
      title: 'Aktif Kullanıcı',
      value: stats.activeUsers.toLocaleString(),
      change: '+8.7%',
      changeType: 'positive',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Ortalama Yanıt Süresi',
      value: `${stats.avgResponseTime}ms`,
      change: '-5.2%',
      changeType: 'positive',
      icon: Clock,
      color: 'orange'
    }
  ];

  const timeRanges = [
    { value: '1d', label: 'Son 24 Saat' },
    { value: '7d', label: 'Son 7 Gün' },
    { value: '30d', label: 'Son 30 Gün' },
    { value: '90d', label: 'Son 3 Ay' },
    { value: '1y', label: 'Son 1 Yıl' }
  ];

  const reportTypes = [
    { value: 'overview', label: 'Genel Bakış', icon: BarChart3 },
    { value: 'institutions', label: 'Kurum Analizi', icon: BookOpen },
    { value: 'keywords', label: 'Anahtar Kelime', icon: Target },
    { value: 'performance', label: 'Performans', icon: TrendingUp }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">
                📊 Raporlar ve Analitik
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Platform kullanım istatistikleri, arama trendleri ve performans raporları
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border p-6 mb-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="font-semibold text-gray-900">Filtreler:</span>
                
                {/* Time Range */}
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>

                {/* Report Type */}
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  CSV İndir
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF Rapor
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {reportCards.map((card, index) => (
              <div
                key={card.title}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-${card.color}-100`}>
                    <card.icon className={`h-6 w-6 text-${card.color}-600`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value}
                </h3>
                <p className="text-sm text-gray-600">
                  {card.title}
                </p>
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Weekly Trend Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Haftalık Arama Trendi
                </h3>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              
              <div className="space-y-4">
                {stats.weeklyTrend.map(day => {
                  const maxSearches = Math.max(...stats.weeklyTrend.map(d => d.searches));
                  const percentage = (day.searches / maxSearches) * 100;
                  
                  return (
                    <div key={day.day} className="flex items-center gap-4">
                      <span className="w-8 text-sm font-medium text-gray-600">
                        {day.day}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-16 text-sm font-medium text-gray-900 text-right">
                        {day.searches.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Top Keywords */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Popüler Anahtar Kelimeler
                </h3>
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              
              <div className="space-y-4">
                {stats.topKeywords.map((keyword, index) => (
                  <div key={keyword.keyword} className="flex items-center gap-4">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{keyword.keyword}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(keyword.count / stats.topKeywords[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {keyword.count}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Institution Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Kurum Performansı
                </h3>
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Kurum</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Aramalar</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Dökümanlar</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Yanıt Süresi</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.institutionStats.slice(0, 8).map(inst => (
                      <tr key={inst.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {INSTITUTIONS.find(i => i.id === inst.id)?.icon}
                            </span>
                            <span className="font-medium text-gray-900">{inst.name}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 text-gray-600">
                          {inst.searches.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-600">
                          {inst.documents.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-600">
                          {inst.responseTime}ms
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            inst.responseTime < 300 
                              ? 'bg-green-100 text-green-800' 
                              : inst.responseTime < 500
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {inst.responseTime < 300 ? 'Hızlı' : inst.responseTime < 500 ? 'Normal' : 'Yavaş'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}