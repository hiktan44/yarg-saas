'use client';

import Link from 'next/link';
import { Shield, User, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden md:block">Profil</span>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    suppressHydrationWarning
                  >
                    Profil Ayarları
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    suppressHydrationWarning
                  >
                    Ayarlar
                  </Link>
                  <button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}