'use client';

import UserTable from '@/components/Admin/UserTable';

export default function UsersPage() {
    return (
        <div>
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #e50914, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        The Judge
                    </h1>
                    <p style={{ color: '#666', marginTop: '5px' }}>User Management & Moderation</p>
                </div>
            </div>

            <UserTable />
        </div>
    );
}
