import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <AppHeader />
            <main className="flex-1 w-full px-4 py-6 md:px-8 lg:px-16">
                {children}
            </main>
            <AppFooter />
        </div>
    );
};

export default Layout;