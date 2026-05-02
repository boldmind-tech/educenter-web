'use client';

import { ReactNode, useEffect } from 'react';
import { ThemeProvider, FontProvider } from '@boldmind-tech/ui';
import type { ProductThemeType } from '@boldmind-tech/ui';

interface EducenterLayoutProps {
  children: ReactNode;
}

const EDUCENTER_THEME: ProductThemeType = {
  slug: 'educenter',
  name: 'EduCenter',
  description: 'Pass Exams. Build Business. Master AI.',
  icon: '🎓',
  status: 'LIVE',
  colors: {
    primary:    '#1E40AF',   // royal blue
    secondary:  '#F59E0B',   // amber
    accent:     '#3B82F6',   // lighter blue for hover states
    background: '#FAFAFA',
  },
};

export function EducenterLayout({ children }: EducenterLayoutProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  return (
    <ThemeProvider
      defaultTheme="light"
      defaultProduct={EDUCENTER_THEME}
    >
      <FontProvider defaultMode="dyslexic">
        {children}
      </FontProvider>
    </ThemeProvider>
  );
}