'use client';

import { ReactNode } from 'react';

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    fullWidth?: boolean;
}

export default function ChartCard({
    title,
    subtitle,
    children,
    fullWidth = false
}: ChartCardProps) {
    return (
        <div className={`chart-card ${fullWidth ? 'full-width' : ''}`}>
            <div className="chart-header">
                <div>
                    <h3 className="chart-title">{title}</h3>
                    {subtitle && <p className="chart-subtitle">{subtitle}</p>}
                </div>
            </div>

            <div className="chart-content">
                {children}
            </div>
        </div>
    );
}
