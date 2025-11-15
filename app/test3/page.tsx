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

export default function Page() {
    const [periods, setPeriods] = useState<string[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [series, setSeries] = useState<SeriesItem[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            const res = await fetch(
                "/data/response4.json"
            );

            const json = await res.json();
            const { periods, labels, series } = json.data;

            setPeriods(periods);
            setLabels(labels);
            setSeries(series);

            // ---------- 차트용 Wide 데이터 생성 ----------
            const wide = periods.map((period, idx) => {
                const row: any = { period };
                series.forEach((s) => {
                    row[s.name] = s.values[idx];
                });
                return row;
            });

            setChartData(wide);
        }

        load();
    }, []);

    if (periods.length === 0) return <div>Loading...</div>;

    const colors = ["#ff6b6b", "#4dabf7", "#40c057", "#845ef7", "#f06595"];

    return (
        <div style={{ padding: 40 }}>
            <h2>매매 시세 (Series 기반 구조)</h2>

            {/* ---------- 차트 ---------- */}
            <div
                style={{
                    width: "100%",
                    height: 400,
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 20,
                    background: "white",
                    marginBottom: 40,
                }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />

                        <XAxis
                            dataKey="period"
                            tickFormatter={(v) => `${v.slice(0, 4)}-${v.slice(4)}`}
                            interval={2}
                        />

                        <YAxis tickFormatter={(v) => `${(v / 10000).toLocaleString()}만`} />

                        <Tooltip
                            formatter={(v: any) => `${v.toLocaleString()}원`}
                            labelFormatter={(label) =>
                                `${label.slice(0, 4)}-${label.slice(4)}`
                            }
                        />

                        <Legend />

                        {/* Series마다 Line 생성 */}
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

            {/* ---------- Pivot Table ---------- */}
            <div style={{ overflowX: "auto", marginTop: 40 }}>
                <table
                    style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        fontSize: 13,
                        color: "#333",
                        background: "white",
                    }}
                >
                    <thead
                        style={{
                            position: "sticky",
                            top: 0,
                            background: "#fafafa",
                            zIndex: 2,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                    >
                    <tr>
                        <th
                            style={{
                                padding: "10px",
                                borderBottom: "1px solid #eee",
                                textAlign: "left",
                                position: "sticky",
                                left: 0,
                                background: "#fafafa",
                                zIndex: 3,
                                whiteSpace: "nowrap",
                            }}
                        >
                            지역명
                        </th>

                        {periods.map((period) => (
                            <th
                                key={period}
                                style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #eee",
                                    background: "#fafafa",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {period.slice(0, 4)}-{period.slice(4)}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {series.map((row) => (
                        <tr key={row.name}>
                            <td
                                style={{
                                    padding: "10px 12px",
                                    borderBottom: "1px solid #f2f2f2",
                                    textAlign: "left",
                                    fontWeight: 500,
                                    position: "sticky",
                                    left: 0,
                                    background: "white",
                                    zIndex: 2,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {row.name}
                            </td>

                            {row.values.map((v, idx) => (
                                <td
                                    key={idx}
                                    style={{
                                        padding: "10px 12px",
                                        borderBottom: "1px solid #f2f2f2",
                                        textAlign: "right",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {v ? v.toLocaleString() : "-"}
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
