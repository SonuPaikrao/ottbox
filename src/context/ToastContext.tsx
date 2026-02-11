'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        setToast({ message, type });
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div className={`toast-container ${toast.type}`}>
                    {toast.message}
                </div>
            )}
            <style jsx global>{`
                .toast-container {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    background: rgba(20, 20, 20, 0.95);
                    backdrop-filter: blur(10px);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                    z-index: 9999;
                    font-weight: 500;
                    animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .toast-container.success { border-left: 4px solid var(--primary); }
                .toast-container.error { border-left: 4px solid #ef4444; }
                
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .toast-container {
                        bottom: 80px; /* Above mobile nav */
                        right: 50%;
                        transform: translateX(50%);
                        width: 90%;
                        justify-content: center;
                        animation: slideUpMobile 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                    @keyframes slideUpMobile {
                        from { opacity: 0; transform: translate(50%, 20px); }
                        to { opacity: 1; transform: translate(50%, 0); }
                    }
                }
            `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
