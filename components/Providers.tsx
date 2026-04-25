// APPS/WEB_APPS/EduCenter-hub/components/Providers.tsx

'use client';

import { AuthProvider } from '@boldmind-tech/auth';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@boldmind-tech/ui';

export function Providers({ children, defaultProductTheme }: {
    children: React.ReactNode;
    defaultProductTheme?: any;
}) {
    return (
        <ThemeProvider defaultProduct={defaultProductTheme}>
            <AuthProvider>
                {children}
                <Toaster position="top-right" richColors />
            </AuthProvider>
        </ThemeProvider>
    );
}
