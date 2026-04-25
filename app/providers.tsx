

'use client';

import { ReactNode } from 'react';
import { EducenterLayout } from './educenterLayout';

/**
 * Thin re-export for backward compatibility.
 * Existing imports of `Providers` will continue to work.
 *
 * @deprecated Use EducenterLayout directly.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <EducenterLayout>{children}</EducenterLayout>;
}