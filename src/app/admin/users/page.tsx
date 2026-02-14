'use client';

import { useEffect, useState } from 'react';
import { Trash2, Search, Check, X } from 'lucide-react';
// import { formatDate } from '@/lib/utils'; // Removed unused import

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
            }
        } catch (error) {
            console.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to PERMANENTLY delete this user? This action cannot be undone.')) return;

        setDeletingId(userId);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (res.ok) {
                // Remove from local state
                setUsers(users.filter(u => u.id !== userId));
                alert('User deleted successfully.');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete user');
            }
        } catch (err) {
            alert('Something went wrong');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{ color: '#fff' }}>Loading Users...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, borderLeft: '4px solid #e50914', paddingLeft: '15px' }}>
                    User Management
                </h1>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#888' }} />
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '10px 10px 10px 40px',
                            background: '#141414',
                            border: '1px solid #333',
                            borderRadius: '6px',
                            color: 'white',
                            width: '300px'
                        }}
                    />
                </div>
            </div>

            <div style={{ background: '#141414', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #333', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                            <th style={{ padding: '20px' }}>User</th>
                            <th style={{ padding: '20px' }}>Provider</th>
                            <th style={{ padding: '20px' }}>Date Joined</th>
                            <th style={{ padding: '20px' }}>Last Sign In</th>
                            <th style={{ padding: '20px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #222' }}>
                                <td style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 'bold', color: '#fff'
                                    }}>
                                        {user.email?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{user.user_metadata?.name || 'User'}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#888' }}>{user.email}</div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    {user.app_metadata?.provider === 'google' ? (
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '20px',
                                            background: '#4285F420', color: '#4285F4', fontSize: '0.85rem', fontWeight: 600
                                        }}>
                                            Google
                                        </span>
                                    ) : (
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '20px',
                                            background: '#333', color: '#ccc', fontSize: '0.85rem', fontWeight: 600
                                        }}>
                                            Email
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '20px', color: '#ccc' }}>
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '20px', color: '#ccc' }}>
                                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        disabled={deletingId === user.id}
                                        style={{
                                            background: '#333', border: 'none',
                                            width: '36px', height: '36px', borderRadius: '6px',
                                            color: '#e50914', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'background 0.2s'
                                        }}
                                        className="hover:bg-red-900/20"
                                    >
                                        {deletingId === user.id ? '...' : <Trash2 size={18} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        No users found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
}
