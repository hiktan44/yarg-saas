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

// Spesifik kurum API'leri
export const YargitayAPI = {
  search: async (query: string, filters?: any) => {
    const response = await axios.post('https://karararama.yargitay.gov.tr/aramadetaylist', {
      arananKelime: query,
      ...filters
    });
    return response.data;
  },
  
  getDocument: async (documentId: string) => {
    const response = await axios.post('https://karararama.yargitay.gov.tr/getDokuman', {
      id: documentId
    });
    return response.data;
  }
};

export const DanistayAPI = {
  search: async (query: string, filters?: any) => {
    const response = await axios.post('https://karararama.danistay.gov.tr/aramadetaylist', {
      arananKelime: query,
      ...filters
    });
    return response.data;
  },
  
  getDocument: async (documentId: string) => {
    const response = await axios.post('https://karararama.danistay.gov.tr/getDokuman', {
      id: documentId
    });
    return response.data;
  }
};

export const EmsalAPI = {
  search: async (query: string, filters?: any) => {
    const response = await axios.post('https://emsal.uyap.gov.tr/aramadetaylist', {
      arananKelime: query,
      ...filters
    });
    return response.data;
  },
  
  getDocument: async (documentId: string) => {
    const response = await axios.post('https://emsal.uyap.gov.tr/getDokuman', {
      id: documentId
    });
    return response.data;
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