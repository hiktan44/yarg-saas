import axios from 'axios';

// Yargı MCP API'leri için temel konfigürasyon
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface InstitutionInfo {
  id: string;
  name: string;
  description: string;
  apiEndpoint: string;
  isActive: boolean;
  totalDocuments: number;
  lastUpdate: string;
  documentTypes: string[];
  searchFields: string[];
}

export interface SearchRequest {
  query: string;
  institutions: string[];
  filters: {
    dateRange?: {
      start: string;
      end: string;
    };
    documentType?: string;
    department?: string;
  };
  pagination: {
    page: number;
    limit: number;
  };
  sortBy: 'date' | 'relevance';
  sortOrder: 'asc' | 'desc';
}

export interface SearchResponse {
  results: DocumentResult[];
  totalCount: number;
  searchTime: number;
  page: number;
  hasMore: boolean;
}

export interface DocumentResult {
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
  metadata?: {
    caseNumber?: string;
    decisionNumber?: string;
    keywords?: string[];
  };
}

// Kurum bilgilerini getir
export const getInstitutions = async (): Promise<InstitutionInfo[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/institutions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching institutions:', error);
    // Fallback data - gerçek API hazır olmadığında
    return getMockInstitutions();
  }
};

// Arama yap
export const searchDocuments = async (request: SearchRequest): Promise<SearchResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/search`, request);
    return response.data;
  } catch (error) {
    console.error('Error searching documents:', error);
    // Fallback - mock data döndür
    return getMockSearchResults(request);
  }
};

// Doküman detaylarını getir
export const getDocumentDetails = async (documentId: string): Promise<DocumentResult | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching document details:', error);
    return null;
  }
};

// 🔥 REAL API IMPLEMENTATIONS
// Rate limiting store
const rateLimits = new Map<string, number[]>();

// Rate limiter function
function checkRateLimit(institutionId: string, limit: number = 30): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  
  if (!rateLimits.has(institutionId)) {
    rateLimits.set(institutionId, []);
  }
  
  const requests = rateLimits.get(institutionId)!;
  const validRequests = requests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  validRequests.push(now);
  rateLimits.set(institutionId, validRequests);
  return true;
}

// 🏛️ Yargıtay Real API
export const YargitayAPI = {
  search: async (query: string, filters?: any) => {
    if (!checkRateLimit('yargitay', 30)) {
      throw new Error('Yargıtay API rate limit exceeded');
    }

    try {
      const searchParams = {
        arananKelime: query,
        baslangicTarihi: filters?.startDate || '',
        bitisTarihi: filters?.endDate || '',
        daire: filters?.department || '',
        sayfa: filters?.page || 1,
        kayitSayisi: filters?.limit || 20
      };

      const response = await axios.post('https://karararama.yargitay.gov.tr/api/arama', searchParams, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'YargiSys-Search/1.0',
          'Accept': 'application/json'
        },
        timeout: 30000
      });

      return {
        success: true,
        data: response.data?.results || [],
        totalCount: response.data?.totalCount || 0,
        executionTime: response.headers['x-response-time'] || 0
      };
    } catch (error: any) {
      console.error('Yargıtay API Error:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },
  
  getDocument: async (documentId: string) => {
    if (!checkRateLimit('yargitay-doc', 20)) {
      throw new Error('Yargıtay document API rate limit exceeded');
    }

    try {
      const response = await axios.get(`https://karararama.yargitay.gov.tr/api/dokuman/${documentId}`, {
        headers: {
          'User-Agent': 'YargiSys-Search/1.0',
          'Accept': 'application/json'
        },
        timeout: 15000
      });

      return response.data;
    } catch (error: any) {
      console.error('Yargıtay Document API Error:', error.message);
      throw error;
    }
  }
};

// 🏛️ Danıştay Real API
export const DanistayAPI = {
  search: async (query: string, filters?: any) => {
    if (!checkRateLimit('danistay', 20)) {
      throw new Error('Danıştay API rate limit exceeded');
    }

    try {
      const searchParams = {
        aramaTerimi: query,
        baslangicTarihi: filters?.startDate || '',
        bitisTarihi: filters?.endDate || '',
        daire: filters?.department || '',
        sayfa: filters?.page || 1,
        kayitSayisi: filters?.limit || 20
      };

      const response = await axios.post('https://www.danistay.gov.tr/api/kararlar/arama', searchParams, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'YargiSys-Search/1.0'
        },
        timeout: 30000
      });

      return {
        success: true,
        data: response.data?.kararlar || [],
        totalCount: response.data?.toplamSayisi || 0,
        executionTime: Date.now()
      };
    } catch (error: any) {
      console.error('Danıştay API Error:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },
  
  getDocument: async (documentId: string) => {
    if (!checkRateLimit('danistay-doc', 15)) {
      throw new Error('Danıştay document API rate limit exceeded');
    }

    try {
      const response = await axios.get(`https://www.danistay.gov.tr/api/kararlar/${documentId}`, {
        timeout: 15000
      });
      return response.data;
    } catch (error: any) {
      console.error('Danıştay Document API Error:', error.message);
      throw error;
    }
  }
};

// 🏛️ Emsal (UYAP) Real API
export const EmsalAPI = {
  search: async (query: string, filters?: any) => {
    if (!checkRateLimit('emsal', 60)) {
      throw new Error('Emsal API rate limit exceeded');
    }

    try {
      const searchParams = {
        q: query,
        start_date: filters?.startDate,
        end_date: filters?.endDate,
        court: filters?.department,
        page: filters?.page || 1,
        size: filters?.limit || 20
      };

      const response = await axios.get('https://emsal.uyap.gov.tr/api/v1/search', {
        params: searchParams,
        headers: {
          'User-Agent': 'YargiSys-Search/1.0',
          'Accept': 'application/json'
        },
        timeout: 25000
      });

      return {
        success: true,
        data: response.data?.hits || [],
        totalCount: response.data?.total || 0,
        executionTime: response.data?.took || 0
      };
    } catch (error: any) {
      console.error('Emsal API Error:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },
  
  getDocument: async (documentId: string) => {
    if (!checkRateLimit('emsal-doc', 40)) {
      throw new Error('Emsal document API rate limit exceeded');
    }

    try {
      const response = await axios.get(`https://emsal.uyap.gov.tr/api/v1/document/${documentId}`, {
        timeout: 10000
      });
      return response.data;
    } catch (error: any) {
      console.error('Emsal Document API Error:', error.message);
      throw error;
    }
  }
};

// 🏛️ Brave Search API (KVKK için)
export const BraveSearchAPI = {
  search: async (query: string, filters?: any) => {
    if (!checkRateLimit('brave-search', 100)) {
      throw new Error('Brave Search API rate limit exceeded');
    }

    try {
      const searchQuery = `site:kvkk.gov.tr ${query}`;
      
      const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
        params: {
          q: searchQuery,
          count: filters?.limit || 20,
          offset: ((filters?.page || 1) - 1) * (filters?.limit || 20),
          country: 'TR',
          search_lang: 'tr',
          ui_lang: 'tr'
        },
        headers: {
          'X-Subscription-Token': process.env.BRAVE_API_KEY,
          'Accept': 'application/json'
        },
        timeout: 20000
      });

      return {
        success: true,
        data: response.data?.web?.results || [],
        totalCount: response.data?.web?.total_count || 0,
        executionTime: Date.now()
      };
    } catch (error: any) {
      console.error('Brave Search API Error:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
};

// 🏛️ Tavily Search API (BDDK için)
export const TavilySearchAPI = {
  search: async (query: string, filters?: any) => {
    if (!checkRateLimit('tavily-search', 100)) {
      throw new Error('Tavily Search API rate limit exceeded');
    }

    try {
      const searchQuery = `site:bddk.org.tr ${query}`;
      
      const response = await axios.post('https://api.tavily.com/search', {
        api_key: process.env.TAVILY_API_KEY,
        query: searchQuery,
        search_depth: 'advanced',
        include_answer: false,
        include_images: false,
        include_raw_content: true,
        max_results: filters?.limit || 20,
        include_domains: ['bddk.org.tr']
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 25000
      });

      return {
        success: true,
        data: response.data?.results || [],
        totalCount: response.data?.results?.length || 0,
        executionTime: Date.now()
      };
    } catch (error: any) {
      console.error('Tavily Search API Error:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
};

// Mock data functions (geliştirme için)
const getMockInstitutions = (): InstitutionInfo[] => [
  {
    id: 'yargitay',
    name: 'Yargıtay',
    description: 'Türkiye Cumhuriyeti Yargıtay kararları ve içtihatları',
    apiEndpoint: 'https://karararama.yargitay.gov.tr',
    isActive: true,
    totalDocuments: 125000,
    lastUpdate: '2024-01-15',
    documentTypes: ['Karar', 'İçtihat', 'Daire Kararı'],
    searchFields: ['başlık', 'içerik', 'anahtar_kelime']
  },
  {
    id: 'danistay',
    name: 'Danıştay',
    description: 'İdari yargı kararları ve görüşleri',
    apiEndpoint: 'https://karararama.danistay.gov.tr',
    isActive: true,
    totalDocuments: 89000,
    lastUpdate: '2024-01-14',
    documentTypes: ['Karar', 'Görüş', 'Daire Kararı'],
    searchFields: ['başlık', 'içerik', 'mevzuat']
  },
  {
    id: 'emsal',
    name: 'Emsal (UYAP)',
    description: 'UYAP Emsal Karar Sistemi',
    apiEndpoint: 'https://emsal.uyap.gov.tr',
    isActive: true,
    totalDocuments: 256000,
    lastUpdate: '2024-01-16',
    documentTypes: ['Emsal Karar', 'İlke Kararı'],
    searchFields: ['başlık', 'içerik', 'mahkeme']
  },
  {
    id: 'bedesten',
    name: 'Bedesten',
    description: 'Adalet Bakanlığı alternatif karar sistemi',
    apiEndpoint: 'https://bedesten.adalet.gov.tr',
    isActive: true,
    totalDocuments: 67000,
    lastUpdate: '2024-01-13',
    documentTypes: ['Karar', 'Mevzuat'],
    searchFields: ['başlık', 'içerik']
  },
  {
    id: 'uyusmazlik',
    name: 'Uyuşmazlık Mahkemesi',
    description: 'Yetki uyuşmazlığı çözüm kararları',
    apiEndpoint: 'https://kararlar.uyusmazlik.gov.tr',
    isActive: true,
    totalDocuments: 12000,
    lastUpdate: '2024-01-12',
    documentTypes: ['Karar'],
    searchFields: ['başlık', 'içerik', 'dava_no']
  },
  {
    id: 'anayasa',
    name: 'Anayasa Mahkemesi',
    description: 'Norm denetimi ve bireysel başvuru kararları',
    apiEndpoint: 'https://normkararlarbilgibankasi.anayasa.gov.tr',
    isActive: true,
    totalDocuments: 45000,
    lastUpdate: '2024-01-15',
    documentTypes: ['Norm Denetimi', 'Bireysel Başvuru'],
    searchFields: ['başlık', 'içerik', 'anayasa_maddesi']
  },
  {
    id: 'kik',
    name: 'KİK',
    description: 'Kamu İhale Kurumu karar ve görüşleri',
    apiEndpoint: 'https://ekap.kik.gov.tr',
    isActive: true,
    totalDocuments: 23000,
    lastUpdate: '2024-01-11',
    documentTypes: ['Kurul Kararı', 'Görüş'],
    searchFields: ['başlık', 'içerik', 'ihale_no']
  },
  {
    id: 'rekabet',
    name: 'Rekabet Kurumu',
    description: 'Rekabet hukuku karar ve analiz raporları',
    apiEndpoint: 'https://www.rekabet.gov.tr',
    isActive: true,
    totalDocuments: 8500,
    lastUpdate: '2024-01-10',
    documentTypes: ['Kurul Kararı', 'Analiz Raporu'],
    searchFields: ['başlık', 'içerik', 'sektor']
  },
  {
    id: 'sayistay',
    name: 'Sayıştay',
    description: 'Mali denetim ve hesap verme kararları',
    apiEndpoint: 'https://www.sayistay.gov.tr',
    isActive: true,
    totalDocuments: 34000,
    lastUpdate: '2024-01-14',
    documentTypes: ['Genel Kurul Kararı', 'Temyiz Kararı', 'Daire Kararı'],
    searchFields: ['başlık', 'içerik', 'kurum']
  },
  {
    id: 'kvkk',
    name: 'KVKK',
    description: 'Kişisel Verileri Koruma Kurulu kararları',
    apiEndpoint: 'https://www.kvkk.gov.tr',
    isActive: true,
    totalDocuments: 1200,
    lastUpdate: '2024-01-16',
    documentTypes: ['Kurul Kararı', 'İlke Kararı'],
    searchFields: ['başlık', 'içerik', 'veri_türü']
  },
  {
    id: 'bddk',
    name: 'BDDK',
    description: 'Bankacılık Düzenleme ve Denetleme Kurumu kararları',
    apiEndpoint: 'https://www.bddk.org.tr',
    isActive: true,
    totalDocuments: 5600,
    lastUpdate: '2024-01-12',
    documentTypes: ['Kurul Kararı', 'Mevzuat'],
    searchFields: ['başlık', 'içerik', 'banka']
  }
];

const getMockSearchResults = (request: SearchRequest): SearchResponse => {
  // Mock arama sonuçları
  const mockResults: DocumentResult[] = [
    {
      id: '1',
      title: 'Yargıtay 1. Hukuk Dairesi - Sözleşme İhlali Davası',
      institution: 'Yargıtay',
      department: '1. Hukuk Dairesi',
      date: '2024-01-15T10:30:00Z',
      summary: 'Taraflar arasındaki sözleşme uyuşmazlığına ilişkin temyiz incelemesi sonucunda verilen karar. Sözleşmenin feshi ve tazminat talepleri değerlendirilmiştir.',
      documentType: 'Temyiz Kararı',
      relevanceScore: 0.95,
      metadata: {
        caseNumber: '2024/1234',
        decisionNumber: '2024/567',
        keywords: ['sözleşme', 'fesih', 'tazminat']
      }
    },
    {
      id: '2',
      title: 'Danıştay 5. Daire - İptal Davası Kararı',
      institution: 'Danıştay',
      department: '5. Daire',
      date: '2024-01-14T14:20:00Z',
      summary: 'İdari işlemin iptali istemi ile açılan davada, işlemin hukuka uygunluğu incelenmiş ve iptal kararı verilmiştir.',
      documentType: 'İptal Kararı',
      relevanceScore: 0.87,
      metadata: {
        caseNumber: '2023/987',
        decisionNumber: '2024/123',
        keywords: ['iptal', 'idari işlem', 'hukuka uygunluk']
      }
    }
  ];

  return {
    results: mockResults,
    totalCount: mockResults.length,
    searchTime: 245,
    page: request.pagination.page,
    hasMore: false
  };
};