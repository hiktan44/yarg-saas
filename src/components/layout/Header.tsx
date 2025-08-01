'use client';

import Link from 'next/link';
import { Shield, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Çıkış yapılırken hata oluştu');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <Link 
              href="/" 
              className="text-xl font-bold text-gray-900"
              suppressHydrationWarning
            >
              YargıSys
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/dashboard" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
              suppressHydrationWarning
            >
              Dashboard
            </Link>
            <Link 
              href="/search" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
              suppressHydrationWarning
            >
              Arama
            </Link>
            <Link 
              href="/reports" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
              suppressHydrationWarning
            >
              Raporlar
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-8 w-8"></div>
              </div>
            ) : user ? (
              // Authenticated user menu
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Kullanıcı'}
                  </span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                      {user.email}
                    </div>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      suppressHydrationWarning
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="inline h-4 w-4 mr-2" />
                      Profil Ayarları
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      suppressHydrationWarning
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Ayarlar
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Guest user buttons
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                  suppressHydrationWarning
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  suppressHydrationWarning
                >
                  Üye Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}