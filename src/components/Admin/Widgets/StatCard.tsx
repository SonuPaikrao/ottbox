'use client';

import { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    trend?: string;
    subtitle?: string;
    loading?: boolean;
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    color,
    trend,
    subtitle,
    loading = false
}: StatCardProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const targetValue = typeof value === 'number' ? value : parseInt(value) || 0;

    // Animated counter effect
    useEffect(() => {
        if (loading || typeof value !== 'number') return;

        const duration = 1000;
        const steps = 30;
        const increment = targetValue / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                setDisplayValue(targetValue);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [targetValue, loading, value]);

    return (
        <div className="stat-card" style={{ '--card-color': color } as React.CSSProperties}>
            <div className="stat-card-content">
                <div className="stat-header">
                    <div className="stat-icon-wrapper">
                        <Icon className="stat-icon" size={24} />
                    </div>
                    <div className="stat-info">
                        <h3 className="stat-title">{title}</h3>
                        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
                    </div>
                </div>

                <div className="stat-value-wrapper">
                    {loading ? (
                        <div className="stat-skeleton" />
                    ) : (
                        <div className="stat-value">
                            {typeof value === 'number' ? displayValue.toLocaleString() : value}
                        </div>
                    )}
                    {trend && (
                        <div className="stat-trend">
                            <span className="trend-badge">{trend}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="stat-card-gradient" />
        </div>
    );
}
