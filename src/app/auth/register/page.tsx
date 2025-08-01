'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const router = useRouter();
  const { signUp } = useAuth();

  // 🚦 Cooldown timer for rate limiting
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Lütfen kullanım koşullarını kabul edin');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.name);
      toast.success('Hesabınız oluşturuldu! E-postanızı kontrol edin ve doğrulama linkine tıklayın.');
      toast('Doğrulama sonrası giriş yapabilirsiniz.', { 
        icon: 'ℹ️', 
        duration: 4000 
      });
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // 🚦 Rate limiting error handling
      if (error.message && error.message.includes('24 seconds')) {
        setCooldownTime(24);
        toast.error('Çok hızlı deneme yaptınız. 24 saniye bekleyip tekrar deneyin.', { duration: 5000 });
      } else if (error.message && error.message.includes('seconds')) {
        // Extract seconds from error message if different
        const match = error.message.match(/(\d+) seconds/);
        const seconds = match ? parseInt(match[1]) : 30;
        setCooldownTime(seconds);
        toast.error(`Çok sık deneme yapıyorsunuz. ${seconds} saniye bekleyin.`, { duration: 5000 });
      } else if (error.message && error.message.includes('Email already registered')) {
        toast.error('Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.');
      } else if (error.message && error.message.includes('Invalid email')) {
        toast.error('Geçersiz e-posta adresi formatı');
      } else if (error.message && error.message.includes('Password')) {
        toast.error('Şifre en az 6 karakter olmalı ve geçerli olmalıdır');
      } else {
        toast.error('Kayıt başarısız: ' + (error.message || 'Bilinmeyen hata'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center"
              suppressHydrationWarning
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Y</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">Yargı SaaS</span>
            </Link>
            <p className="mt-2 text-gray-600">Yeni hesap oluşturun</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre Tekrar
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                <Link 
                  href="/terms" 
                  className="text-blue-600 hover:underline"
                  suppressHydrationWarning
                >
                  Kullanım koşullarını
                </Link>{' '}
                kabul ediyorum
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading || cooldownTime > 0}
            >
              {loading 
                ? 'Kayıt yapılıyor...' 
                : cooldownTime > 0 
                  ? `Bekleyin... (${cooldownTime}s)` 
                  : 'Kayıt Ol'
              }
            </Button>

            {/* 🚦 Rate Limit Warning */}
            {cooldownTime > 0 && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center">
                  <div className="text-orange-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      Güvenlik Sınırı
                    </p>
                    <p className="text-xs text-orange-700">
                      Çok hızlı deneme yaptığınız için {cooldownTime} saniye beklemeniz gerekiyor.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
                          <p className="text-sm text-gray-600">
                Zaten hesabınız var mı?{' '}
                <Link 
                  href="/auth/login" 
                  className="text-blue-600 hover:underline"
                  suppressHydrationWarning
                >
                  Giriş yapın
                </Link>
              </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}