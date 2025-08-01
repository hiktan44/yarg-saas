'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Users, FileText, BarChart3, Clock, CheckCircle, Building2, Calendar, Database, Globe, Zap } from 'lucide-react';
import { INSTITUTIONS } from '@/lib/constants';

const features = [
  {
    icon: Shield,
    title: 'Güvenli Veri Yönetimi',
    description: 'End-to-end şifreleme ile hassas hukuki verilerin güvenliği'
  },
  {
    icon: Users,
    title: 'Çoklu Kurum Entegrasyonu',
    description: 'Mahkemeler, savcılıklar ve icra müdürlükleri arası veri paylaşımı'
  },
  {
    icon: FileText,
    title: 'Akıllı Belge İşleme',
    description: 'AI destekli belge analizi ve otomatik kategorizasyon'
  },
  {
    icon: BarChart3,
    title: 'Gerçek Zamanlı Raporlama',
    description: 'Anlık istatistikler ve performans göstergeleri'
  },
  {
    icon: Clock,
    title: 'Süreç Otomasyonu',
    description: 'Manuel işlemleri minimize eden akıllı iş akışları'
  },
  {
    icon: CheckCircle,
    title: 'Uyumluluk Takibi',
    description: 'Yasal gerekliliklere tam uyum ve denetim izleri'
  }
];

// Kurumlar artık constants'tan geliyor (INSTITUTIONS array)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">YargıSys</span>
            </div>
            <nav className="hidden md:flex space-x-8">
                          <Link 
              href="#features" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
              suppressHydrationWarning
            >
              Özellikler
            </Link>
            <Link 
              href="#institutions" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
              suppressHydrationWarning
            >
              Kurumlar
            </Link>
            <Link 
              href="/auth/login" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              suppressHydrationWarning
            >
              Giriş Yap
            </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Yargı Kurumu
              <span className="text-blue-600"> Veri Entegrasyonu</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Türkiye'nin adalet sistemini dijitalleştiren, güvenli ve entegre SaaS platformu. 
              Tüm yargı kurumlarını tek çatı altında birleştiren modern çözüm.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                href="/auth/register" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center group"
                suppressHydrationWarning
              >
                Hemen Başla
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/auth/login" 
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                suppressHydrationWarning
              >
                Giriş Yap
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Platform Özellikleri</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Modern teknoloji ile adalet sisteminin ihtiyaçlarına özel geliştirilmiş özellikler</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Institutions Section */}
      <section id="institutions" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Entegre Kurumlar
              <span className="ml-3 text-2xl">{INSTITUTIONS.length}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Türkiye'nin en önemli 11 yargı kurumundan 
              <span className="font-semibold text-blue-600 mx-2">
                {INSTITUTIONS.reduce((total, inst) => total + inst.totalDocuments, 0).toLocaleString('tr-TR')}+
              </span>
              belge ve karar tek platformda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INSTITUTIONS.map((institution, index) => (
              <motion.div
                key={institution.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200"
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{institution.icon}</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {institution.name}
                        </h3>

                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {institution.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Database className="w-4 h-4 text-blue-600 mr-1" />
                        <span className="text-xs text-blue-600 font-medium">Belge</span>
                      </div>
                      <div className="text-lg font-bold text-blue-700">
                        {institution.totalDocuments.toLocaleString('tr-TR')}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Calendar className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-xs text-green-600 font-medium">Güncelleme</span>
                      </div>
                      <div className="text-sm font-bold text-green-700">
                        {new Date(institution.lastUpdate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>

                  {/* API Type & Coverage */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      {institution.apiType}
                    </span>
                    <span className="flex items-center">
                      <Globe className="w-3 h-3 mr-1" />
                      {institution.coverage}
                    </span>
                  </div>

                  {/* Special Features */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Özel Özellikler:</h4>
                    <div className="flex flex-wrap gap-1">
                      {institution.specialFeatures.slice(0, 2).map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                      {institution.specialFeatures.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                          +{institution.specialFeatures.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Departments Count */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Building2 className="w-3 h-3 mr-1" />
                    <span>{institution.departments.length} Daire/Departman</span>
                  </div>
                </div>

                {/* Hover Effect Bottom Bar */}
                <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Platform Geneli İstatistikler</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {INSTITUTIONS.length}
                </div>
                <div className="text-gray-600">Entegre Kurum</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {INSTITUTIONS.reduce((total, inst) => total + inst.totalDocuments, 0).toLocaleString('tr-TR')}+
                </div>
                <div className="text-gray-600">Toplam Belge</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {INSTITUTIONS.length}
                </div>
                <div className="text-gray-600">Toplam Kurum</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {new Set(INSTITUTIONS.flatMap(inst => inst.specialFeatures)).size}+
                </div>
                <div className="text-gray-600">Özel Özellik</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Dijital Dönüşüme Hazır mısınız?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Adalet sisteminin geleceğini şekillendiren platformumuza katılın</p>
          <Link 
            href="/auth/register" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center group"
            suppressHydrationWarning
          >
            Ücretsiz Deneme Başlat
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">YargıSys</span>
              </div>
              <p className="text-gray-400">Türkiye'nin adalet sistemini dijitalleştiren güvenli platform</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link 
                    href="#features" 
                    className="hover:text-white transition-colors"
                    suppressHydrationWarning
                  >
                    Özellikler
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#institutions" 
                    className="hover:text-white transition-colors"
                    suppressHydrationWarning
                  >
                    Kurumlar
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/auth/login" 
                    className="hover:text-white transition-colors"
                    suppressHydrationWarning
                  >
                    Giriş
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Destek</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a 
                    href="#" 
                    className="hover:text-white transition-colors"
                    suppressHydrationWarning
                  >
                    Yardım Merkezi
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="hover:text-white transition-colors"
                    suppressHydrationWarning
                  >
                    İletişim
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="hover:text-white transition-colors"
                    suppressHydrationWarning
                  >
                    Dokümantasyon
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Yasal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a 
                    href="#" 
                    className="hover:text-white transition-colors"
                    suppressHydrationWarning
                  >
                    Gizlilik Politikası
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="hover:text-white transition-colors"
                    suppressHydrationWarning
                  >
                    Kullanım Şartları
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="hover:text-white transition-colors"
                    suppressHydrationWarning
                  >
                    KVKK
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 YargıSys. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}