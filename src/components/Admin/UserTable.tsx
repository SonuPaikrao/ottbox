'use client';

import { useState, useEffect } from 'react';
import { Search, MoreVertical, Ban, Eye, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UserDetailsModal from './UserDetailsModal';

interface User {
    id: string;
    email: string;
    created_at: string;
    provider: string;
    last_sign_in_at: string | null;
    banned_until: string | null;
}

export default function UserTable() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const query = searchQuery ? `&query=${encodeURIComponent(searchQuery)}` : '';
            const res = await fetch(`/api/God-Mod-MH1214/users?page=${page}&limit=10${query}`, {
                cache: 'no-store'
            });

            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchUsers(), 300);
        return () => clearTimeout(timer);
    }, [searchQuery, page]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const getStatusBadge = (user: User) => {
        const isBanned = user.banned_until && new Date(user.banned_until) > new Date();
        return (
            <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: isBanned ? 'rgba(229, 9, 20, 0.1)' : 'rgba(70, 211, 105, 0.1)',
                border: `1px solid ${isBanned ? 'rgba(229, 9, 20, 0.3)' : 'rgba(70, 211, 105, 0.3)'}`,
                color: isBanned ? '#e50914' : '#46d369'
            }}>
                {isBanned ? 'BANNED' : 'ACTIVE'}
            </span>
        );
    };

    return (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
                padding: 'var(--spacing-lg)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-md)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-md)'
                }}>
                    <div>
                        <h2 style={{
                            margin: 0,
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            marginBottom: '4px'
                        }}>
                            User Management
                        </h2>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Total: {users.length} users
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search
                        size={18}
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-tertiary)'
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search users by email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 12px 10px 40px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            outline: 'none',
                            transition: 'all var(--transition-fast)'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                </div>
            </div>

            {/* User Cards - Mobile Friendly */}
            <div style={{ padding: 'var(--spacing-md)' }}>
                {loading ? (
                    <div style={{
                        padding: '48px',
                        textAlign: 'center',
                        color: 'var(--text-secondary)'
                    }}>
                        Loading users...
                    </div>
                ) : users.length === 0 ? (
                    <div style={{
                        padding: '48px',
                        textAlign: 'center',
                        color: 'var(--text-secondary)'
                    }}>
                        No users found
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 'var(--spacing-md)'
                    }}>
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="user-card"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '12px',
                                    padding: 'var(--spacing-md)',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-fast)'
                                }}
                                onClick={() => setSelectedUserId(user.id)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* User Header */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-md)',
                                    marginBottom: 'var(--spacing-md)'
                                }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #e50914, #ff6b6b)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem',
                                        fontWeight: 700,
                                        color: '#fff'
                                    }}>
                                        {user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: 600,
                                            color: 'var(--text-primary)',
                                            marginBottom: '2px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {user.email}
                                        </div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-tertiary)'
                                        }}>
                                            ID: {user.id.substring(0, 8)}...
                                        </div>
                                    </div>
                                </div>

                                {/* User Details */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 'var(--spacing-sm)',
                                    marginBottom: 'var(--spacing-md)',
                                    paddingTop: 'var(--spacing-md)',
                                    borderTop: '1px solid var(--border-subtle)'
                                }}>
                                    <div>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            color: 'var(--text-tertiary)',
                                            marginBottom: '4px',
                                            textTransform: 'uppercase'
                                        }}>
                                            Joined
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--text-secondary)',
                                            fontWeight: 500
                                        }}>
                                            {formatDate(user.created_at)}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            color: 'var(--text-tertiary)',
                                            marginBottom: '4px',
                                            textTransform: 'uppercase'
                                        }}>
                                            Method
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--text-secondary)',
                                            fontWeight: 500,
                                            textTransform: 'capitalize'
                                        }}>
                                            {user.provider}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            color: 'var(--text-tertiary)',
                                            marginBottom: '4px',
                                            textTransform: 'uppercase'
                                        }}>
                                            Last Active
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--text-secondary)',
                                            fontWeight: 500
                                        }}>
                                            {formatDate(user.last_sign_in_at)}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            color: 'var(--text-tertiary)',
                                            marginBottom: '4px',
                                            textTransform: 'uppercase'
                                        }}>
                                            Status
                                        </div>
                                        {getStatusBadge(user)}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        background: 'rgba(229, 9, 20, 0.1)',
                                        border: '1px solid rgba(229, 9, 20, 0.3)',
                                        borderRadius: '6px',
                                        color: 'var(--accent-primary)',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedUserId(user.id);
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--accent-primary)';
                                        e.currentTarget.style.color = '#fff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(229, 9, 20, 0.1)';
                                        e.currentTarget.style.color = 'var(--accent-primary)';
                                    }}
                                >
                                    <Eye size={16} />
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{
                    padding: 'var(--spacing-lg)',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)'
                }}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{
                            padding: '8px 16px',
                            background: page === 1 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            color: page === 1 ? 'var(--text-tertiary)' : 'var(--text-primary)',
                            cursor: page === 1 ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}
                    >
                        Previous
                    </button>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={{
                            padding: '8px 16px',
                            background: page === totalPages ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            color: page === totalPages ? 'var(--text-tertiary)' : 'var(--text-primary)',
                            cursor: page === totalPages ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* User Details Modal */}
            {selectedUserId && (
                <UserDetailsModal
                    userId={selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                    onUpdate={fetchUsers}
                />
            )}
        </div>
    );
}
