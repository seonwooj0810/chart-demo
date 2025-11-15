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

interface WideRow {
    [key: string]: number | string;
}

export default function Page() {
    const [data, setData] = useState<WideRow[]>([]);
    const [areas, setAreas] = useState<string[]>([]); // 지역명 목록
    const [periods, setPeriods] = useState<string[]>([]); // 기간 목록

    useEffect(() => {
        async function load() {
            const res = await fetch("/data/price.json"); // 새 구조
            const json = await res.json();

            const prices = json.data.prices;

            // --------------------------
            // 1) 기간 리스트
            // --------------------------
            const periodList = prices.map((p: any) => p.period);

            // --------------------------
            // 2) 지역명 리스트 (metrics 안에서 추출)
            // --------------------------
            const areaSet = new Set<string>();
            prices.forEach((p: any) => {
                p.metrics.forEach((m: any) => areaSet.add(m.name));
            });
            const areaList = Array.from(areaSet);

            // --------------------------
            // 3) Narrow → Wide 변환
            // --------------------------
            const wideRows: WideRow[] = prices.map((p: any) => {
                const row: WideRow = { period: p.period };

                p.metrics.forEach((m: any) => {
                    row[m.name] = m.price;
                });

                return row;
            });

            setPeriods(periodList);
            setAreas(areaList);
            setData(wideRows);
        }

        load();
    }, []);

    if (data.length === 0) return <div>Loading…</div>;

    const colors = ["#ff6b6b", "#4dabf7", "#40c057", "#845ef7", "#f06595"];

    return (
        <div style={{ padding: 40, background: "white" }}>
            <h2>매매 시세 (Narrow → Wide 변환)</h2>

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
                    <LineChart data={data} margin={{ top: 20, right: 30, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />

                        <XAxis
                            dataKey="period"
                            tickFormatter={(v) => `${v.slice(0, 4)}-${v.slice(4)}`}
                            interval={1}
                        />
                        <YAxis
                            tickFormatter={(v) =>
                                v ? `${Math.floor((v as number) / 1000)}천` : v
                            }
                        />

                        <Tooltip
                            formatter={(v: any) => `${v.toLocaleString()}원`}
                            labelFormatter={(l) => `${l.slice(0, 4)}-${l.slice(4)}`}
                        />

                        <Legend />

                        {areas.map((area, idx) => (
                            <Line
                                key={area}
                                type="monotone"
                                dataKey={area}
                                stroke={colors[idx % colors.length]}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* ---------- 하단 테이블 ---------- */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                    <tr>
                        <th
                            style={{
                                borderBottom: "2px solid #ddd",
                                padding: 8,
                                background: "#fafafa",
                                textAlign: "left",
                            }}
                        >
                            지역명
                        </th>

                        {periods.map((p) => (
                            <th
                                key={p}
                                style={{
                                    borderBottom: "2px solid #ddd",
                                    padding: 8,
                                    background: "#fafafa",
                                    textAlign: "right",
                                }}
                            >
                                {p.slice(0, 4)}-{p.slice(4)}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {areas.map((area) => (
                        <tr key={area}>
                            <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                                {area}
                            </td>

                            {periods.map((period) => (
                                <td
                                    key={period}
                                    style={{
                                        padding: 8,
                                        borderBottom: "1px solid #eee",
                                        textAlign: "right",
                                    }}
                                >
                                    {data.find((r) => r.period === period)?.[area]
                                        ? Number(
                                            data.find((r) => r.period === period)?.[area]
                                        ).toLocaleString()
                                        : "-"}
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
