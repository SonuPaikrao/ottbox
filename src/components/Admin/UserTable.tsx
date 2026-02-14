'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    SortingState,
    ColumnDef
} from '@tanstack/react-table';
import { Search, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UserDetailsModal from './UserDetailsModal';

export default function UserTable() {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [pageCount, setPageCount] = useState(0);

    // Modal State
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const page = pagination.pageIndex + 1;
            const limit = pagination.pageSize;
            const query = globalFilter ? `&query=${encodeURIComponent(globalFilter)}` : '';

            const res = await fetch(`/api/God-Mod-MH1214/users?page=${page}&limit=${limit}${query}`, { cache: 'no-store' });
            if (res.ok) {
                const result = await res.json();
                setData(result.users);
                setPageCount(result.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce Search Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300); // 300ms debounce
        return () => clearTimeout(timer);
    }, [globalFilter, pagination.pageIndex, pagination.pageSize]); // Refetch on filter/page change

    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'created_at',
                header: 'Joined Date',
                cell: info => {
                    const value = info.getValue() as string;
                    return value ? new Date(value).toLocaleDateString() : 'N/A';
                },
            },
            {
                accessorKey: 'email',
                header: 'User',
                cell: info => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setSelectedUserId(info.row.original.id)}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>
                            {(info.getValue() as string).charAt(0).toUpperCase()}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 500, color: '#fff' }}>{info.getValue() as string}</span>
                            <span style={{ fontSize: '0.75rem', color: '#888' }}>ID: {info.row.original.id.substring(0, 8)}...</span>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'provider',
                header: 'Method',
                cell: info => (
                    <span style={{ textTransform: 'capitalize', color: '#aaa', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {info.getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: 'last_sign_in_at',
                header: 'Last Active',
                cell: info => info.getValue() ? new Date(info.getValue() as string).toLocaleString() : 'Never',
            },
            {
                accessorKey: 'banned_until',
                header: 'Status',
                cell: info => {
                    const isBanned = info.getValue() && new Date(info.getValue() as string) > new Date();
                    return (
                        <span className={`status-badge ${isBanned ? 'status-banned' : 'status-active'}`}>
                            {isBanned ? 'BANNED' : 'ACTIVE'}
                        </span>
                    );
                },
            },
            {
                id: 'actions',
                cell: props => (
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => setSelectedUserId(props.row.original.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '5px' }}
                            title="View Details"
                        >
                            <MoreVertical size={18} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            pagination
        },
        pageCount: pageCount, // manual pagination
        manualPagination: true, // Tell table we handle pagination server-side
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        // getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="user-table-container">
            {/* Modal */}
            {selectedUserId && (
                <UserDetailsModal
                    userId={selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                    onUpdate={fetchData}
                />
            )}

            {/* Table Controls */}
            <div className="table-controls">
                <div style={{ position: 'relative' }}>
                    <Search size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        className="search-input"
                        placeholder="Search users by email..."
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table className="user-table">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{
                                            asc: ' 🔼',
                                            desc: ' 🔽',
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                                    Loading users...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination-controls">
                <span style={{ color: '#888', fontSize: '0.9rem', marginRight: '10px' }}>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <button
                    className="page-btn"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft size={16} />
                </button>
                <button
                    className="page-btn"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
