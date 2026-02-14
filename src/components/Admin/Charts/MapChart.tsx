'use client';

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapChartProps {
    data: { name: string; coordinates: [number, number]; value: number }[];
}

export default function MapChart({ data }: MapChartProps) {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 100,
                }}
                style={{ width: "100%", height: "100%" }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }: { geographies: any[] }) =>
                        geographies.map((geo: any) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#2a2a2a"
                                stroke="#333"
                                strokeWidth={0.5}
                                style={{
                                    default: { outline: "none" },
                                    hover: { fill: "#333", outline: "none" },
                                    pressed: { outline: "none" },
                                }}
                            />
                        ))
                    }
                </Geographies>

                {data.map(({ name, coordinates, value }) => (
                    <Marker key={name} coordinates={coordinates}>
                        <circle r={4} fill="#e50914" stroke="#fff" strokeWidth={2} />
                        <text
                            textAnchor="middle"
                            y={-10}
                            style={{ fontFamily: "system-ui", fill: "#fff", fontSize: "10px", fontWeight: "bold" }}
                        >
                            {name}
                        </text>
                    </Marker>
                ))}
            </ComposableMap>
        </div>
    );
}
