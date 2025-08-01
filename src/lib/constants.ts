export const INSTITUTIONS = [
  {
    id: 'adalet-bakanligi',
    name: 'Adalet Bakanlığı',
    description: 'Merkezi koordinasyon ve politika belirleme',
    status: 'active'
  },
  {
    id: 'yargitay',
    name: 'Yargıtay',
    description: 'Temyiz mercii veri entegrasyonu',
    status: 'integration'
  },
  {
    id: 'danistay',
    name: 'Danıştay',
    description: 'İdari yargı veri yönetimi',
    status: 'planned'
  },
  {
    id: 'anayasa-mahkemesi',
    name: 'Anayasa Mahkemesi',
    description: 'Anayasal denetim süreçleri',
    status: 'planned'
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