# 🏛️ Yargı SaaS Projesi

Modern, kapsamlı Türk hukuk sistemi arama ve analiz platformu. **11 farklı hukuk kurumunun** verilerinde AI destekli arama ve analiz imkanı sunan SaaS uygulaması.

## ✨ Özellikler

### 🔍 Gelişmiş Arama Sistemi
- **11 kurum desteği**: Yargıtay, Danıştay, Emsal (UYAP), Bedesten, KVKK, BDDK ve daha fazlası
- **Unified search**: Tüm kurumları tek seferde arayabilme
- **Akıllı filtreleme**: Tarih aralığı, daire, kurum bazlı filtreleme
- **Real-time search**: Anlık arama sonuçları

### 🤖 AI Analiz Özellikleri
- **Çoklu LLM desteği**: ChatGPT, Claude, Gemini entegrasyonu
- **Doküman analizi**: Otomatik özet, hukuki analiz, anahtar noktalar
- **Soru-cevap sistemi**: Belgelerle etkileşimli sohbet
- **Benzer dava önerileri**: AI tabanlı emsal karar bulma

### 💾 Kullanıcı Deneyimi
- **Bookmark sistemi**: Önemli belgeleri kaydetme
- **Arama geçmişi**: Önceki aramaları takip etme
- **Detay paneli**: Yan panelde doküman detayları
- **Responsive tasarım**: Mobil, tablet, desktop uyumlu

## 🏗️ Teknik Yapı

### Frontend
- **Next.js 14**: App Router, Server Components
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animasyonlar
- **Lucide React**: Modern iconlar

### Backend & Database
- **Supabase**: PostgreSQL, Auth, Real-time
- **Next.js API Routes**: Backend endpoints
- **Row Level Security**: Veri güvenliği

### AI/LLM Entegrasyonu
- **OpenAI GPT-4**: ChatGPT desteği
- **Anthropic Claude**: Claude AI desteği
- **Google Gemini**: Google AI desteği

## 📦 Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Çevre Değişkenlerini Ayarlayın
`.env.local` dosyası oluşturun:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# LLM API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 🎯 Kullanılan Kurumlar

1. **Yargıtay** - Türkiye Cumhuriyeti Yargıtay kararları
2. **Danıştay** - İdari yargı kararları
3. **Emsal (UYAP)** - UYAP Emsal Karar Sistemi
4. **Bedesten** - Adalet Bakanlığı alternatif sistem
5. **Uyuşmazlık Mahkemesi** - Yetki uyuşmazlığı çözümleri
6. **Anayasa Mahkemesi** - Norm denetimi kararları
7. **KİK** - Kamu İhale Kurumu kararları
8. **Rekabet Kurumu** - Rekabet hukuku uygulamaları
9. **Sayıştay** - Mali denetim kararları
10. **KVKK** - Veri koruma kararları
11. **BDDK** - Bankacılık mevzuat ve kararları

## 🚀 Özellikler

- ✅ Modern ve responsive tasarım
- ✅ 11 kurum entegrasyonu
- ✅ AI destekli analiz
- ✅ Bookmark sistemi
- ✅ Arama geçmişi
- ✅ Güvenli kimlik doğrulama
- ✅ Real-time arama
- ✅ Detaylı filtreleme

## 📱 Ekran Görüntüleri

### Ana Sayfa (Landing Page)
- Modern hero section
- Kurum showcase
- Özellikler bölümü

### Dashboard
- Kurum seçim kartları
- Gelişmiş arama arayüzü
- Sonuç listeleme

### AI Analiz Paneli
- Çoklu LLM desteği
- Etkileşimli sohbet
- Doküman analizi

## 🛡️ Güvenlik

- Row Level Security (RLS) politikaları
- Güvenli API endpoint'leri
- Kullanıcı veri koruması

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

⚖️ **Hukuki Uyarı**: Bu uygulama sadece bilgilendirme amaçlıdır. Resmi hukuki danışmanlık yerine geçmez.