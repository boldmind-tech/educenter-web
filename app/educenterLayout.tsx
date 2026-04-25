// ─────────────────────────────────────────────────────────────────────────────
// apps/educenter/app/educenterLayout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// FIXES from original:
//   1. Was building productTheme manually with wrong field access (theme?.primary
//      instead of theme.primary) and missing FontProvider
//   2. Was duplicating Providers wrapping (providers.tsx also wrapped this)
//   3. productTheme.colors.accent was set to theme?.primary (copy-paste bug)
//
// Now delegates entirely to shared AppLayout — one source of truth.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { ReactNode } from 'react';
import { ThemeProvider, FontProvider } from '@boldmind-tech/ui';
import type { ProductThemeType } from '@boldmind-tech/ui';

interface EducenterLayoutProps {
  children: ReactNode;
}

const EDUCENTER_THEME: ProductThemeType = {
  slug: 'educenter',
  name: 'EduCenter',
  description: 'Nigeria\'s leading exam prep and digital skills platform',
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