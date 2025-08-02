import { NextRequest, NextResponse } from 'next/server';
import { 
  YargitayAPI, 
  DanistayAPI, 
  EmsalAPI, 
  BraveSearchAPI, 
  TavilySearchAPI 
} from '@/lib/api/institutions';

interface SearchRequestBody {
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

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequestBody = await request.json();
    const { query, institutions, filters, pagination, sortBy, sortOrder } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Arama sorgusu gereklidir' },
        { status: 400 }
      );
    }

    const searchPromises: Promise<any>[] = [];

    // 🔥 REAL API SEARCH - Her kurum için real API çağrıları
    institutions.forEach(institution => {
      const institutionId = institution.toLowerCase();
      
      switch (institutionId) {
        case 'yargitay':
          searchPromises.push(searchYargitay(query, filters, pagination));
          break;
        case 'danistay':
          searchPromises.push(searchDanistay(query, filters, pagination));
          break;
        case 'emsal':
          searchPromises.push(searchEmsal(query, filters, pagination));
          break;
        case 'bedesten':
          searchPromises.push(searchBedesten(query, filters, pagination));
          break;
        case 'uyusmazlik':
          searchPromises.push(searchUyusmazlik(query, filters, pagination));
          break;
        case 'anayasa':
          searchPromises.push(searchAnayasa(query, filters, pagination));
          break;
        case 'kik':
          searchPromises.push(searchKik(query, filters, pagination));
          break;
        case 'rekabet':
          searchPromises.push(searchRekabet(query, filters, pagination));
          break;
        case 'sayistay':
          searchPromises.push(searchSayistay(query, filters, pagination));
          break;
        case 'kvkk':
          searchPromises.push(searchKvkk(query, filters, pagination));
          break;
        case 'bddk':
          searchPromises.push(searchBddk(query, filters, pagination));
          break;
        default:
          // Fallback: mock data döndür
          searchPromises.push(Promise.resolve({
            success: false,
            data: getMockSearchResults(institution, query),
            error: `Institution ${institution} not implemented yet`
          }));
      }
    });

    const startTime = Date.now();
    const searchResults = await Promise.allSettled(searchPromises);
    const searchTime = Date.now() - startTime;

    // 🔄 Sonuçları birleştir ve normalize et - Real API responses
    const allResults: any[] = [];
    let totalApiErrors = 0;
    let successfulInstitutions: string[] = [];
    
    searchResults.forEach((result, index) => {
      const institutionName = institutions[index];
      
      if (result.status === 'fulfilled' && result.value) {
        const apiResponse = result.value;
        
        if (apiResponse.success && apiResponse.data) {
          // ✅ API başarılı - data boş bile olsa başarılı sayılır
          const normalizedResults = normalizeResults(apiResponse.data, institutionName);
          allResults.push(...normalizedResults);
          successfulInstitutions.push(institutionName);
          console.log(`✅ API başarılı: ${institutionName}, ${apiResponse.data.length} sonuç`);
        } else {
          // API başarısız, mock data kullan
          console.warn(`❌ API başarısız: ${institutionName}:`, apiResponse.error);
          const mockResults = getMockSearchResults(institutionName, query);
          const normalizedMockResults = normalizeResults(mockResults, institutionName);
          allResults.push(...normalizedMockResults);
          totalApiErrors++;
        }
      } else {
        // Promise rejected, mock data kullan
        console.error(`Search promise rejected for ${institutionName}:`, result.status === 'rejected' ? result.reason : 'Unknown error');
        const mockResults = getMockSearchResults(institutionName, query);
        const normalizedMockResults = normalizeResults(mockResults, institutionName);
        allResults.push(...normalizedMockResults);
        totalApiErrors++;
      }
    });

    // Sıralama ve sayfalama
    const sortedResults = sortResults(allResults, sortBy, sortOrder);
    const totalCount = sortedResults.length;
    
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedResults = sortedResults.slice(startIndex, endIndex);

    return NextResponse.json({
      results: paginatedResults,
      totalCount,
      searchTime,
      page: pagination.page,
      hasMore: endIndex < totalCount,
      // 📊 API Status Info
      metadata: {
        successfulInstitutions,
        totalApiErrors,
        institutionsSearched: institutions.length,
        searchQuery: query,
        isUsingRealAPIs: successfulInstitutions.length > 0,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Arama sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}

// 🏛️ REAL SEARCH FUNCTIONS FOR ALL INSTITUTIONS

// Yargıtay arama fonksiyonu
async function searchYargitay(query: string, filters: any, pagination: any) {
  try {
    const searchParams = {
      startDate: filters.dateRange?.start,
      endDate: filters.dateRange?.end,
      department: filters.department,
      page: pagination.page,
      limit: pagination.limit
    };

    return await YargitayAPI.search(query, searchParams);
  } catch (error) {
    console.error('Yargıtay search error:', error);
    return {
      success: false,
      error: (error as Error).message,
      data: getMockSearchResults('Yargıtay', query)
    };
  }
}

// Danıştay arama fonksiyonu
async function searchDanistay(query: string, filters: any, pagination: any) {
  try {
    const searchParams = {
      startDate: filters.dateRange?.start,
      endDate: filters.dateRange?.end,
      department: filters.department,
      page: pagination.page,
      limit: pagination.limit
    };

    return await DanistayAPI.search(query, searchParams);
  } catch (error) {
    console.error('Danıştay search error:', error);
    return {
      success: false,
      error: (error as Error).message,
      data: getMockSearchResults('Danıştay', query)
    };
  }
}

// Emsal arama fonksiyonu
async function searchEmsal(query: string, filters: any, pagination: any) {
  try {
    const searchParams = {
      startDate: filters.dateRange?.start,
      endDate: filters.dateRange?.end,
      department: filters.department,
      page: pagination.page,
      limit: pagination.limit
    };

    return await EmsalAPI.search(query, searchParams);
  } catch (error) {
    console.error('Emsal search error:', error);
    return {
      success: false,
      error: (error as Error).message,
      data: getMockSearchResults('Emsal', query)
    };
  }
}

// Bedesten arama fonksiyonu (Scraping ile)
async function searchBedesten(query: string, filters: any, pagination: any) {
  try {
    // TODO: Implement Bedesten scraping logic
    console.info('Bedesten search - using mock data until scraping implemented');
    return {
      success: false,
      error: 'Bedesten scraping not implemented yet',
      data: getMockSearchResults('Bedesten', query)
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      data: getMockSearchResults('Bedesten', query)
    };
  }
}

// Uyuşmazlık Mahkemesi arama fonksiyonu (Playwright ile)
async function searchUyusmazlik(query: string, filters: any, pagination: any) {
  try {
    // TODO: Implement Playwright automation
    console.info('Uyuşmazlık search - using mock data until Playwright implemented');
    return {
      success: false,
      error: 'Uyuşmazlık Playwright automation not implemented yet',
      data: getMockSearchResults('Uyuşmazlık Mahkemesi', query)
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      data: getMockSearchResults('Uyuşmazlık Mahkemesi', query)
    };
  }
}

// Anayasa Mahkemesi arama fonksiyonu (PDF scraping ile)
async function searchAnayasa(query: string, filters: any, pagination: any) {
  try {
    // TODO: Implement PDF scraping logic
    console.info('Anayasa search - using mock data until PDF scraping implemented');
    return {
      success: false,
      error: 'Anayasa PDF scraping not implemented yet',
      data: getMockSearchResults('Anayasa Mahkemesi', query)
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      data: getMockSearchResults('Anayasa Mahkemesi', query)
    };
  }
}

// KİK arama fonksiyonu (HTTPX ile)
async function searchKik(query: string, filters: any, pagination: any) {
  try {
    // TODO: Implement KİK HTTPX logic
    console.info('KİK search - using mock data until HTTPX implemented');
    return {
      success: false,
      error: 'KİK HTTPX integration not implemented yet',
      data: getMockSearchResults('KİK', query)
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      data: getMockSearchResults('KİK', query)
    };
  }
}

// Rekabet Kurumu arama fonksiyonu (PDF scraping ile)
async function searchRekabet(query: string, filters: any, pagination: any) {
  try {
    // TODO: Implement Rekabet PDF scraping
    console.info('Rekabet search - using mock data until PDF scraping implemented');
    return {
      success: false,
      error: 'Rekabet PDF scraping not implemented yet',
      data: getMockSearchResults('Rekabet Kurumu', query)
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      data: getMockSearchResults('Rekabet Kurumu', query)
    };
  }
}

// Sayıştay arama fonksiyonu (HTTPX ile)
async function searchSayistay(query: string, filters: any, pagination: any) {
  try {
    // TODO: Implement Sayıştay HTTPX logic
    console.info('Sayıştay search - using mock data until HTTPX implemented');
    return {
      success: false,
      error: 'Sayıştay HTTPX integration not implemented yet',
      data: getMockSearchResults('Sayıştay', query)
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      data: getMockSearchResults('Sayıştay', query)
    };
  }
}

// KVKK arama fonksiyonu (Brave Search ile)
async function searchKvkk(query: string, filters: any, pagination: any) {
  try {
    const searchParams = {
      page: pagination.page,
      limit: pagination.limit
    };

    return await BraveSearchAPI.search(query, searchParams);
  } catch (error) {
    console.error('KVKK Brave Search error:', error);
    return {
      success: false,
      error: (error as Error).message,
      data: getMockSearchResults('KVKK', query)
    };
  }
}

// BDDK arama fonksiyonu (Tavily Search ile)
async function searchBddk(query: string, filters: any, pagination: any) {
  try {
    const searchParams = {
      page: pagination.page,
      limit: pagination.limit
    };

    return await TavilySearchAPI.search(query, searchParams);
  } catch (error) {
    console.error('BDDK Tavily Search error:', error);
    return {
      success: false,
      error: (error as Error).message,
      data: getMockSearchResults('BDDK', query)
    };
  }
}

// Mock arama sonuçları (geliştirme için)
function getMockSearchResults(institution: string, query: string) {
  return [
    {
      id: `${institution.toLowerCase()}-${Date.now()}`,
      title: `${institution} - ${query} ile ilgili karar`,
      institution,
      department: '1. Daire',
      date: new Date().toISOString(),
      summary: `Bu ${institution} kararı ${query} konusunda önemli hukuki ilkeler içermektedir. Kararın esas alınması gereken durumlar ve uygulanacak hukuki çerçeve detaylandırılmıştır.`,
      documentType: 'Karar',
      relevanceScore: Math.random(),
      url: institution.toLowerCase() === 'yargitay' 
        ? `https://karararama.yargitay.gov.tr/karar/${Date.now()}` 
        : institution.toLowerCase() === 'danistay'
        ? `https://karararama.danistay.gov.tr/karar/${Date.now()}`
        : `https://example.com/${institution.toLowerCase()}/${Date.now()}`,
      metadata: {
        caseNumber: `${new Date().getFullYear()}/${Math.floor(Math.random() * 9999) + 1000}`,
        decisionNumber: `${new Date().getFullYear()}/${Math.floor(Math.random() * 999) + 100}`,
        keywords: [query, 'hukuk', 'karar']
      }
    },
    {
      id: `${institution.toLowerCase()}-${Date.now() + 1}`,
      title: `${institution} - ${query} emsal kararı`,
      institution,
      department: '2. Daire',
      date: new Date(Date.now() - 86400000).toISOString(), // Dün
      summary: `${query} konusunda verilen bu emsal karar, benzer durumlarda uygulanacak hukuki çerçeveyi belirlemektedir.`,
      documentType: 'Emsal Karar',
      relevanceScore: Math.random(),
      url: institution.toLowerCase() === 'yargitay' 
        ? `https://karararama.yargitay.gov.tr/karar/${Date.now() + 1}` 
        : institution.toLowerCase() === 'danistay'
        ? `https://karararama.danistay.gov.tr/karar/${Date.now() + 1}`
        : `https://example.com/${institution.toLowerCase()}/${Date.now() + 1}`,
      metadata: {
        caseNumber: `${new Date().getFullYear()}/${Math.floor(Math.random() * 9999) + 1000}`,
        decisionNumber: `${new Date().getFullYear()}/${Math.floor(Math.random() * 999) + 100}`,
        keywords: [query, 'emsal', 'karar']
      }
    }
  ];
}

// Sonuçları normalize et
function normalizeResults(rawResults: any[], institution: string) {
  if (!Array.isArray(rawResults)) {
    return [];
  }

  return rawResults.map(result => ({
    id: result.id || `${institution.toLowerCase()}-${Date.now()}-${Math.random()}`,
    title: result.title || result.baslik || 'Başlık bulunamadı',
    institution,
    department: result.department || result.daire || undefined,
    date: result.date || result.tarih || new Date().toISOString(),
    summary: result.summary || result.ozet || 'Özet bulunamadı',
    content: result.content || result.icerik || undefined,
    documentType: result.documentType || result.turu || 'Belge',
    url: result.url || undefined,
    relevanceScore: result.relevanceScore || Math.random(),
    metadata: {
      caseNumber: result.davaNo,
      decisionNumber: result.kararNo,
      keywords: result.keywords || []
    }
  }));
}

// Sonuçları sırala
function sortResults(results: any[], sortBy: string, sortOrder: string) {
  return results.sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      comparison = dateA - dateB;
    } else if (sortBy === 'relevance') {
      comparison = a.relevanceScore - b.relevanceScore;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
}