import { NextRequest, NextResponse } from 'next/server';
import { YargitayAPI, DanistayAPI, EmsalAPI } from '@/lib/api/institutions';

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

    // Her kurum için arama yap
    institutions.forEach(institution => {
      switch (institution.toLowerCase()) {
        case 'yargitay':
          searchPromises.push(searchYargitay(query, filters));
          break;
        case 'danistay':
          searchPromises.push(searchDanistay(query, filters));
          break;
        case 'emsal':
          searchPromises.push(searchEmsal(query, filters));
          break;
        // Diğer kurumlar için de benzer şekilde eklenecek
        default:
          // Mock data döndür
          searchPromises.push(Promise.resolve(getMockSearchResults(institution, query)));
      }
    });

    const startTime = Date.now();
    const searchResults = await Promise.allSettled(searchPromises);
    const searchTime = Date.now() - startTime;

    // Sonuçları birleştir ve normalize et
    const allResults: any[] = [];
    searchResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        const institutionName = institutions[index];
        const normalizedResults = normalizeResults(result.value, institutionName);
        allResults.push(...normalizedResults);
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
      hasMore: endIndex < totalCount
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Arama sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Yargıtay arama fonksiyonu
async function searchYargitay(query: string, filters: any) {
  try {
    const searchParams = {
      arananKelime: query,
      tarihBasla: filters.dateRange?.start || '',
      tarihBitis: filters.dateRange?.end || '',
      daire: filters.department || ''
    };

    return await YargitayAPI.search(query, searchParams);
  } catch (error) {
    console.error('Yargıtay search error:', error);
    return getMockSearchResults('Yargıtay', query);
  }
}

// Danıştay arama fonksiyonu
async function searchDanistay(query: string, filters: any) {
  try {
    const searchParams = {
      arananKelime: query,
      tarihBasla: filters.dateRange?.start || '',
      tarihBitis: filters.dateRange?.end || '',
      daire: filters.department || ''
    };

    return await DanistayAPI.search(query, searchParams);
  } catch (error) {
    console.error('Danıştay search error:', error);
    return getMockSearchResults('Danıştay', query);
  }
}

// Emsal arama fonksiyonu
async function searchEmsal(query: string, filters: any) {
  try {
    const searchParams = {
      arananKelime: query,
      tarihBasla: filters.dateRange?.start || '',
      tarihBitis: filters.dateRange?.end || '',
      mahkeme: filters.department || ''
    };

    return await EmsalAPI.search(query, searchParams);
  } catch (error) {
    console.error('Emsal search error:', error);
    return getMockSearchResults('Emsal', query);
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
      url: `https://example.com/${institution.toLowerCase()}/${Date.now()}`,
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
      url: `https://example.com/${institution.toLowerCase()}/${Date.now() + 1}`,
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