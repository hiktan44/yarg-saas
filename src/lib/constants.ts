export const INSTITUTIONS = [
  {
    id: 'yargitay',
    name: 'Yargıtay',
    description: 'Türkiye\'nin en yüksek temyiz mahkemesi. Ceza ve hukuk dairelerinde alınan tüm kararlar.',
    status: 'Aktif',
    totalDocuments: 2850000,
    lastUpdate: '2024-01-16',
    departments: ['1. Ceza Dairesi', '2. Ceza Dairesi', '1. Hukuk Dairesi', '2. Hukuk Dairesi', 'Ceza Genel Kurulu', 'Hukuk Genel Kurulu'],
    specialFeatures: ['Temyiz İncelemeleri', 'İçtihat Birleştirme', 'Kanun Yolu Denetimi'],
    apiType: 'REST + Scraping',
    coverage: '1950-2024',
    icon: '⚖️'
  },
  {
    id: 'danistay',
    name: 'Danıştay',
    description: 'İdari yargının en yüksek mercii. İptal ve tam yargı davalarında son karar veren kurum.',
    status: 'Aktif',
    totalDocuments: 1650000,
    lastUpdate: '2024-01-15',
    departments: ['1. Daire', '2. Daire', '3. Daire', '4. Daire', '5. Daire', 'İdari Dava Daireleri Kurulu'],
    specialFeatures: ['İdari İşlem İptali', 'Tam Yargı Davaları', 'Düzenleyici İşlem Denetimi'],
    apiType: 'REST API',
    coverage: '1960-2024',
    icon: '🏛️'
  },
  {
    id: 'emsal',
    name: 'Emsal (UYAP)',
    description: 'Ulusal Yargı Ağı Projesi kapsamında tüm mahkemelerden emsal karar sistemi.',
    status: 'Aktif',
    totalDocuments: 8200000,
    lastUpdate: '2024-01-16',
    departments: ['Tüm Mahkemeler', 'Asliye Hukuk', 'Asliye Ceza', 'İcra Hukuk', 'Sulh Hukuk', 'Sulh Ceza'],
    specialFeatures: ['Gerçek Zamanlı Güncelleme', 'Tam Metin Arama', 'Kategori Filtreleme'],
    apiType: 'UYAP API',
    coverage: '1990-2024',
    icon: '📋'
  },
  {
    id: 'bedesten',
    name: 'Bedesten',
    description: 'Adalet Bakanlığı\'nın resmi karar ve genelge arşivi. Hukuki düzenlemeler ve uygulamalar.',
    status: 'Aktif',
    totalDocuments: 450000,
    lastUpdate: '2024-01-14',
    departments: ['Adalet Bakanlığı', 'Hukuk İşleri Genel Müdürlüğü', 'Ceza İşleri Genel Müdürlüğü'],
    specialFeatures: ['Resmi Genelgeler', 'Bakanlık Kararları', 'Hukuki Düzenlemeler'],
    apiType: 'XML Feed',
    coverage: '1950-2024',
    icon: '📜'
  },
  {
    id: 'uyusmazlik-mahkemesi',
    name: 'Uyuşmazlık Mahkemesi',
    description: 'Adli ve idari yargı arasındaki görev ve hüküm uyuşmazlıklarını çözen kurum.',
    status: 'Aktif',
    totalDocuments: 35000,
    lastUpdate: '2024-01-12',
    departments: ['Genel Kurul', 'Büyük Genel Kurul', 'Başkanlık'],
    specialFeatures: ['Görev Uyuşmazlıkları', 'Hüküm Uyuşmazlıkları', 'Yetki Tespiti'],
    apiType: 'REST API',
    coverage: '1980-2024',
    icon: '⚡'
  },
  {
    id: 'anayasa-mahkemesi',
    name: 'Anayasa Mahkemesi',
    description: 'Anayasaya uygunluk denetimi yapan en yüksek yarg organi. Anayasal şikayetler ve norm denetimi.',
    status: 'Aktif',
    totalDocuments: 85000,
    lastUpdate: '2024-01-13',
    departments: ['1. Bölüm', '2. Bölüm', '3. Bölüm', 'Genel Kurul', 'Başkanlık'],
    specialFeatures: ['Norm Denetimi', 'Anayasal Şikayet', 'Siyasi Parti Kapatma'],
    apiType: 'XML + REST',
    coverage: '1962-2024',
    icon: '🏛️'
  },
  {
    id: 'kik',
    name: 'KİK (Kurul İçtihatları)',
    description: 'Çeşitli kurul ve komisyonların aldığı kararların toplandığı içtihat kataloğu.',
    status: 'Aktif',
    totalDocuments: 125000,
    lastUpdate: '2024-01-10',
    departments: ['Çeşitli Kurullar', 'Komisyonlar', 'Özel Kurumlar'],
    specialFeatures: ['Kurul Kararları', 'İçtihat Analizi', 'Kategori Bazlı Arama'],
    apiType: 'Scraping',
    coverage: '1990-2024',
    icon: '📖'
  },
  {
    id: 'rekabet-kurumu',
    name: 'Rekabet Kurumu',
    description: 'Rekabet hukuku alanında alınan kararlar. Kartel, tekel ve birleşme denetimi kararları.',
    status: 'Aktif',
    totalDocuments: 15500,
    lastUpdate: '2024-01-15',
    departments: ['Kurul', 'Başkanlık', 'Sektör Uzmanları'],
    specialFeatures: ['Kartel Cezaları', 'Birleşme İzinleri', 'Tekel Denetimi'],
    apiType: 'REST API',
    coverage: '1997-2024',
    icon: '🏢'
  },
  {
    id: 'sayistay',
    name: 'Sayıştay',
    description: 'Devletin mali denetim organı. Kamu kaynaklarının kullanımına dair denetim raporları.',
    status: 'Aktif',
    totalDocuments: 95000,
    lastUpdate: '2024-01-11',
    departments: ['1. Daire', '2. Daire', '3. Daire', '4. Daire', '5. Daire', 'Genel Kurul'],
    specialFeatures: ['Mali Denetim', 'Performans Denetimi', 'Uygunluk Denetimi'],
    apiType: 'XML Feed',
    coverage: '1980-2024',
    icon: '💰'
  },
  {
    id: 'kvkk',
    name: 'KVKK',
    description: 'Kişisel Verileri Koruma Kurulu. Veri koruma hukuku alanındaki tüm karar ve düzenlemeler.',
    status: 'Aktif',
    totalDocuments: 2850,
    lastUpdate: '2024-01-16',
    departments: ['Kurul', 'Başkanlık', 'Denetim Departmanı'],
    specialFeatures: ['Veri İhlali Cezaları', 'İdari Para Cezaları', 'Aydınlatma Yükümlülükleri'],
    apiType: 'Brave Search API',
    coverage: '2018-2024',
    icon: '🔒'
  },
  {
    id: 'bddk',
    name: 'BDDK',
    description: 'Bankacılık Düzenleme ve Denetleme Kurumu. Finansal sektör düzenlemeleri ve denetim kararları.',
    status: 'Aktif',
    totalDocuments: 8900,
    lastUpdate: '2024-01-14',
    departments: ['Kurul', 'Başkanlık', 'Denetim Departmanları'],
    specialFeatures: ['Banka Lisansları', 'Finansal Düzenlemeler', 'Denetim Raporları'],
    apiType: 'Tavily Search API',
    coverage: '2000-2024',
    icon: '🏦'
  }
];

export const CASE_TYPES = [
  { id: 'ceza', name: 'Ceza', description: 'Ceza hukuku davaları' },
  { id: 'hukuk', name: 'Hukuk', description: 'Medeni hukuk davaları' },
  { id: 'idari', name: 'İdari', description: 'İdari yargı davaları' },
  { id: 'anayasa', name: 'Anayasa', description: 'Anayasal denetim' }
];

export const USER_ROLES = [
  { id: 'admin', name: 'Sistem Yöneticisi', permissions: ['all'] },
  { id: 'judge', name: 'Hakim', permissions: ['read', 'write', 'approve'] },
  { id: 'prosecutor', name: 'Savcı', permissions: ['read', 'write'] },
  { id: 'clerk', name: 'Katip', permissions: ['read', 'write'] },
  { id: 'viewer', name: 'Görüntüleyici', permissions: ['read'] }
];

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh'
  },
  cases: {
    list: '/api/cases',
    create: '/api/cases',
    update: '/api/cases/:id',
    delete: '/api/cases/:id'
  },
  search: {
    cases: '/api/search/cases',
    documents: '/api/search/documents'
  },
  reports: {
    generate: '/api/reports/generate',
    download: '/api/reports/download/:id'
  }
};