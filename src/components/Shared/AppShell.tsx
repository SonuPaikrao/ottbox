'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar/Navbar";
import MobileNav from "@/components/Navbar/MobileNav";
import Footer from "@/components/Shared/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main style={{ minHeight: '100vh' }}>
                {children}
            </main>
            <Footer />
            <MobileNav />
        </>
    );
}
