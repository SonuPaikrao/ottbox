'use client';

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface DataPoint {
    name: string;
    value: number;
    color: string;
}

interface DeviceChartProps {
    data: DataPoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid #333',
                padding: '10px',
                borderRadius: '8px',
                color: '#fff'
            }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>
                    {payload[0].name}: {payload[0].value}%
                </p>
            </div>
        );
    }
    return null;
};

export default function DeviceChart({ data }: DeviceChartProps) {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
