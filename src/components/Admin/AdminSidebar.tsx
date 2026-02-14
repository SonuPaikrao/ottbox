'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, BarChart2, LogOut, X } from 'lucide-react';

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', href: '/admin', icon: BarChart2 },
        { name: 'User Management', href: '/admin/users', icon: Users },
    ];

    return (
        <aside style={{
            width: '250px',
            backgroundColor: '#0a0a0a',
            borderRight: '1px solid #222',
            height: '100vh',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0
        }}>
            <div style={{ marginBottom: '40px', padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <span style={{ color: '#e50914', fontSize: '1.5rem', fontWeight: 800 }}>OTT ADMIN</span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888' }} className="d-md-none">
                    <X size={24} />
                </button>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 15px',
                                borderRadius: '8px',
                                color: isActive ? '#fff' : '#888',
                                backgroundColor: isActive ? '#e50914' : 'transparent',
                                textDecoration: 'none',
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            <link.icon size={20} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <Link
                href="/"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    color: '#888',
                    textDecoration: 'none',
                    marginTop: 'auto'
                }}
            >
                <LogOut size={20} />
                Exit to App
            </Link>
        </aside>
    );
}
