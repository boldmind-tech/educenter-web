'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { useAuthStore, clearRefreshToken } from '@/lib/auth';


import {
  School,
  BookOpen,
  TrendingUp,
  Sparkles,
  LayoutDashboard,
  CreditCard,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, status } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  /* ------------------ AUTH GUARD ------------------ */
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [session, status, router]);

  /* ------------------ THEME ------------------ */
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    setIsDark(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', !isDark);
  };

  /* ------------------ LOGOUT ------------------ */
  const handleLogout = () => {
    clearRefreshToken();
    useAuthStore.getState().clearSession();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard',
    },
    {
      name: 'Study Hub',
      href: '/study-hub',
      icon: BookOpen,
      current: pathname?.startsWith('/study-hub'),
    },
    {
      name: 'Business School',
      href: '/business-school',
      icon: TrendingUp,
      current: pathname?.startsWith('/business-school'),
    },
    {
      name: 'AI Skills Lab',
      href: '/ai-lab',
      icon: Sparkles,
      current: pathname?.startsWith('/ai-lab'),
    },
    {
      name: 'Subscriptions',
      href: '/subscription',
      icon: CreditCard,
      current: pathname === '/subscription',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-6 border-b flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <School className="w-7 h-7 text-blue-600" />
              <span className="font-bold text-lg">EduCenter</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    item.current
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun /> : <Moon />}
              <span>{isDark ? 'Light' : 'Dark'} Mode</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        <header className="lg:hidden bg-white dark:bg-gray-800 border-b px-4 py-4 flex justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <School className="w-6 h-6 text-blue-600" />
            <span className="font-bold">EduCenter</span>
          </Link>
          <div />
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
