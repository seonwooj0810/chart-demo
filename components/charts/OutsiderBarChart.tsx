"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { WideRow } from "@/types/chart";

interface Props {
    data: WideRow[];
    labels: string[];
}

export default function OutsiderBarChart({ data, labels }: Props) {
    // 평균 계산
    const avg =
        data.length > 0
            ? Math.round(
                data.reduce(
                    (sum, r) =>
                        sum + Number(r[labels[0]] || 0),
                    0
                ) / data.length
            )
            : 0;

    return (
        <div className="w-full h-[380px] bg-white p-4 rounded-xl shadow">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                    <XAxis dataKey="기간" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {avg > 0 && (
                        <ReferenceLine
                            y={avg}
                            stroke="gray"
                            strokeDasharray="4 4"
                            label={`평균 ${avg}`}
                        />
                    )}

                    {labels.map((label) => (
                        <Bar
                            key={label}
                            dataKey={label}
                            fill="#8cb3ff"
                            barSize={22}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
