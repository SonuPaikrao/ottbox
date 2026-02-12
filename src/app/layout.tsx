import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Use google font
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import MobileNav from "@/components/Navbar/MobileNav";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { WatchlistProvider } from "@/context/WatchlistContext";
import { HistoryProvider } from "@/context/HistoryContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'), // Replace with actual domain in production
  title: {
    default: "OTT Box | Premium Streaming",
    template: "%s | OTT Box"
  },
  description: "Watch the latest movies and series in high quality. No ads, just entertainment.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/icons/icon-192x192.png",
  },
  keywords: ["streaming", "movies", "series", "watch online", "ott box", "netflix clone"],
  openGraph: {
    title: "OTT Box | Premium Streaming",
    description: "Watch the latest movies and series in high quality.",
    url: 'http://localhost:3000',
    siteName: 'OTT Box',
    images: [
      {
        url: '/og-image.jpg', // You would typically have a default OG image
        width: 1200,
        height: 630,
        alt: 'OTT Box Player',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "OTT Box | Premium Streaming",
    description: "Watch the latest movies and series in high quality.",
    images: ['/og-image.jpg'],
  },
};

export const viewport = {
  themeColor: '#e50914',
};

import InstallPrompt from "@/components/Shared/InstallPrompt";
import SplashScreen from "@/components/Shared/SplashScreen";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <WatchlistProvider>
            <ToastProvider>
              <HistoryProvider>
                <Navbar />
                <main style={{ minHeight: '100vh' }}>
                  {children}
                </main>
                <InstallPrompt />
                <MobileNav />
                <SplashScreen />
              </HistoryProvider>
            </ToastProvider>
          </WatchlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
