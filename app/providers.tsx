

'use client';

import { ReactNode } from 'react';
import { EducenterLayout } from './educenterLayout';
export function Providers({ children }: { children: ReactNode }) {
  return <EducenterLayout>{children}</EducenterLayout>;
}