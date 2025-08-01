'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Users, FileText, BarChart3, Clock, CheckCircle } from 'lucide-react';

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

const institutions = [
  {
    name: 'Adalet Bakanlığı',
    description: 'Merkezi koordinasyon ve politika belirleme',
    status: 'Aktif'
  },
  {
    name: 'Yargıtay',
    description: 'Temyiz mercii veri entegrasyonu',
    status: 'Entegrasyon'
  },
  {
    name: 'Danıştay',
    description: 'İdari yargı veri yönetimi',
    status: 'Planlanan'
  },
  {
    name: 'Anayasa Mahkemesi',
    description: 'Anayasal denetim süreçleri',
    status: 'Planlanan'
  }
];

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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Entegre Kurumlar</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Türkiye'nin tüm yargı kurumları tek platform altında</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {institutions.map((institution, index) => (
              <motion.div
                key={institution.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{institution.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    institution.status === 'Aktif' ? 'bg-green-100 text-green-800' :
                    institution.status === 'Entegrasyon' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {institution.status}
                  </span>
                </div>
                <p className="text-gray-600">{institution.description}</p>
              </motion.div>
            ))}
          </div>
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