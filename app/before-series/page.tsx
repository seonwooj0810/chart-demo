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

interface Row {
    일자: string;
    주소: string;
    "관할 시도외 서울": number;
    "관할 시도외 기타": number;
    합계: number;
}

interface ApiResponse {
    success: boolean;
    data: {
        list: Row[];
        "전체 관할 시도외 서울": number;
        "전체 관할 시도외 기타": number;
        "전체 합계": number;
        "전체 평균": number;
    };
}

export default function Page() {
    const [periods, setPeriods] = useState<string[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [series, setSeries] = useState<{ name: string; values: number[] }[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            const res = await fetch("/data/before-series.json"); // list 기반 응답 JSON
            const json: ApiResponse = await res.json();
            const list = json.data.list;

            // ------------------------------
            // 1. periods(일자) 추출
            // ------------------------------
            const periods = list.map((row) => row.일자);
            setPeriods(periods);

            // ------------------------------
            // 2. labels 추출
            //    주소 + 관할 시도외 서울 + 기타 + 합계
            // ------------------------------
            const regionLabel = list[0].주소; // 단일 주소 가정
            const labels = [
                regionLabel,
                "관할 시도외 기타",
                "관할 시도외 서울",
                "합계",
            ];
            setLabels(labels);

            // ------------------------------
            // 3. series 생성
            // ------------------------------
            const regionSeries = list.map((row) => row["관할 시도외 기타"]);
            const etcSeries = list.map((row) => row["관할 시도외 기타"]);
            const seoulSeries = list.map((row) => row["관할 시도외 서울"]);
            const totalSeries = list.map((row) => row["합계"]);

            const seriesData = [
                { name: regionLabel, values: regionSeries },
                { name: "관할 시도외 기타", values: etcSeries },
                { name: "관할 시도외 서울", values: seoulSeries },
                { name: "합계", values: totalSeries },
            ];

            setSeries(seriesData);

            // ------------------------------
            // 4. wide-format 변환 (chart용)
            // ------------------------------
            const wide = periods.map((p, i) => {
                const row: any = { period: p };

                seriesData.forEach((s) => {
                    row[s.name] = s.values[i];
                });

                return row;
            });

            setChartData(wide);
        }

        load();
    }, []);

    if (!chartData.length) return <div>Loading…</div>;

    const colors = ["#ff6b6b", "#4dabf7", "#40c057", "#845ef7", "#f06595"];

    return (
        <div style={{ padding: 40 }}>
            <h2>외지인 거래량 — list 기반 응답 렌더링</h2>

            {/* ================== CHART ================== */}
            <div
                style={{
                    width: "100%",
                    height: 400,
                    border: "1px solid #ddd",
                    padding: 20,
                    borderRadius: 8,
                    background: "white",
                    marginBottom: 50,
                }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Legend />

                        {series.map((s, i) => (
                            <Line
                                key={s.name}
                                type="monotone"
                                dataKey={s.name}
                                stroke={colors[i % colors.length]}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* ================== TABLE ================== */}
            <h3>Pivot Table</h3>
            <div style={{ overflowX: "auto", marginTop: 20 }}>
                <table
                    style={{
                        borderCollapse: "collapse",
                        fontSize: 13,
                        width: "100%",
                        background: "white",
                    }}
                >
                    <thead>
                    <tr>
                        <th
                            style={{
                                padding: 10,
                                borderBottom: "1px solid #eee",
                                background: "#fafafa",
                                position: "sticky",
                                left: 0,
                                zIndex: 2,
                                textAlign: "left",
                            }}
                        >
                            구분
                        </th>

                        {periods.map((p) => (
                            <th
                                key={p}
                                style={{
                                    padding: 10,
                                    borderBottom: "1px solid #eee",
                                    background: "#fafafa",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {p}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {series.map((s) => (
                        <tr key={s.name}>
                            <td
                                style={{
                                    padding: 10,
                                    borderBottom: "1px solid #f2f2f2",
                                    background: "white",
                                    position: "sticky",
                                    left: 0,
                                    zIndex: 1,
                                    fontWeight: 500,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {s.name}
                            </td>
                            {s.values.map((v, i) => (
                                <td
                                    key={i}
                                    style={{
                                        padding: 10,
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
