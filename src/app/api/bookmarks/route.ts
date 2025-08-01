import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Kullanıcı kimlik doğrulama
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Kimlik doğrulama gerekli' },
        { status: 401 }
      );
    }

    // Kullanıcının kayıtlı belgelerini getir
    const { data: bookmarks, error } = await supabase
      .from('saved_documents')
      .select(`
        *,
        created_at,
        updated_at
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Kayıtlı belgeler getirilemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bookmarks: bookmarks || []
    });

  } catch (error) {
    console.error('Bookmarks GET error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Kullanıcı kimlik doğrulama
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Kimlik doğrulama gerekli' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { documentId, title, institution, summary, url, metadata } = body;

    if (!documentId || !title || !institution) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Belge zaten kayıtlı mı kontrol et
    const { data: existing } = await supabase
      .from('saved_documents')
      .select('id')
      .eq('user_id', user.id)
      .eq('document_id', documentId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Belge zaten kayıtlı' },
        { status: 409 }
      );
    }

    // Yeni bookmark ekle
    const { data: bookmark, error } = await supabase
      .from('saved_documents')
      .insert({
        user_id: user.id,
        document_id: documentId,
        title,
        institution,
        summary,
        document_url: url,
        metadata: metadata || null
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Belge kaydedilemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bookmark
    });

  } catch (error) {
    console.error('Bookmarks POST error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Kullanıcı kimlik doğrulama
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Kimlik doğrulama gerekli' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { error: 'Doküman ID gerekli' },
        { status: 400 }
      );
    }

    // Bookmark'ı sil
    const { error } = await supabase
      .from('saved_documents')
      .delete()
      .eq('user_id', user.id)
      .eq('document_id', documentId);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Belge silinemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Belge kayıtlardan silindi'
    });

  } catch (error) {
    console.error('Bookmarks DELETE error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}