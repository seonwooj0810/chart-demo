"use client";

import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface SeriesItem {
    name: string;
    values: number[];
}

interface ApiResponse {
    success: boolean;
    data: {
        periods: string[];
        labels: string[];
        series: SeriesItem[];
    };
}

export default function Page() {
    const [periods, setPeriods] = useState<string[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [series, setSeries] = useState<SeriesItem[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            const response = await fetch("/data/after-series.json");
            const json: ApiResponse = await response.json();
            const { periods, labels, series } = json.data;

            setPeriods(periods);
            setLabels(labels);
            setSeries(series);

            // wide-format 변환 (차트용)
            const wide = periods.map((period, idx) => {
                const row: any = { period };
                series.forEach(s => {
                    row[s.name] = s.values[idx];
                });
                return row;
            });

            setChartData(wide);
        }

        load();
    }, []);

    if (chartData.length === 0) {
        return <div>Loading...</div>;
    }

    const colors = ["#ff6b6b", "#4dabf7", "#40c057", "#845ef7", "#f06595"];

    return (
        <div style={{ padding: 40 }}>
            <h2>외지인 거래량 (Series 기반 구조)</h2>

            {/* ======================== CHART ======================== */}
            <div
                style={{
                    width: "100%",
                    height: 400,
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    padding: 20,
                    background: "white",
                    marginBottom: 50,
                }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                        <XAxis
                            dataKey="period"
                            tickFormatter={(v) => `${v.slice(0, 4)}-${v.slice(4)}`}
                        />
                        <YAxis tickFormatter={(v) => v.toLocaleString()} />
                        <Tooltip
                            formatter={(v: any) => v.toLocaleString()}
                            labelFormatter={(l) => `${l.slice(0, 4)}-${l.slice(4)}`}
                        />
                        <Legend />
                        {series.map((s, idx) => (
                            <Line
                                key={s.name}
                                type="monotone"
                                dataKey={s.name}
                                stroke={colors[idx % colors.length]}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* ======================== TABLE ======================== */}
            <h3>Pivot Table</h3>
            <div style={{ overflowX: "auto", marginTop: 20 }}>
                <table
                    style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        fontSize: 13,
                        color: "#333",
                        background: "white",
                    }}
                >
                    <thead>
                    <tr>
                        <th
                            style={{
                                padding: "10px",
                                borderBottom: "1px solid #eee",
                                textAlign: "left",
                                background: "#fafafa",
                                position: "sticky",
                                left: 0,
                                zIndex: 2,
                            }}
                        >
                            지역명
                        </th>

                        {periods.map((p) => (
                            <th
                                key={p}
                                style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #eee",
                                    background: "#fafafa",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {p.slice(0, 4)}-{p.slice(4)}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {series.map((row) => (
                        <tr key={row.name}>
                            <td
                                style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #f2f2f2",
                                    textAlign: "left",
                                    whiteSpace: "nowrap",
                                    fontWeight: 500,
                                    background: "white",
                                    position: "sticky",
                                    left: 0,
                                    zIndex: 1,
                                }}
                            >
                                {row.name}
                            </td>

                            {row.values.map((v, idx) => (
                                <td
                                    key={idx}
                                    style={{
                                        padding: "10px",
                                        borderBottom: "1px solid #f2f2f2",
                                        textAlign: "right",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {v === 0 ? "-" : v.toLocaleString()}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
