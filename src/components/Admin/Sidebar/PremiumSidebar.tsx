'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Shield
} from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/God-Mod-MH1214', icon: LayoutDashboard },
    { label: 'User Management', href: '/God-Mod-MH1214/users', icon: Users },
    { label: 'Analytics', href: '/God-Mod-MH1214/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/God-Mod-MH1214/settings', icon: Settings },
];

export default function PremiumSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const supabase = getSupabaseBrowserClient();

    const handleLogout = async () => {
        if (confirm('Are you sure you want to logout?')) {
            await supabase.auth.signOut();
            router.push('/God-Mod-MH1214/login');
        }
    };

    const isActive = (href: string) => {
        if (href === '/God-Mod-MH1214') {
            return pathname === href;
        }
        return pathname?.startsWith(href);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="sidebar-mobile-toggle"
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`premium-sidebar ${isOpen ? 'open' : ''}`}>
                {/* Logo/Brand */}
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <Shield size={32} className="logo-icon" />
                        <div className="logo-text">
                            <h1>OTT ADMIN</h1>
                            <p>God Mode</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push(item.href);
                                    setIsOpen(false);
                                }}
                                className={`nav-item ${active ? 'active' : ''}`}
                            >
                                <Icon size={20} className="nav-icon" />
                                <span className="nav-label">{item.label}</span>
                                {active && <div className="active-indicator" />}
                            </a>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-button">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
