"use client";

import {PivotRow} from "@/types/chart";

interface Props {
    pivot: PivotRow[];
    periods: string[];
}

export default function OutsiderPivotTable({pivot, periods}: Props) {
    return (
        <div className="overflow-x-auto mt-8">
            <table className="min-w-full border text-sm bg-white rounded-xl shadow">
                <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="px-4 py-2 text-left">구분</th>
                    {periods.map((p) => (
                        <th key={p} className="px-4 py-2 text-center">
                            {p}
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {pivot.map((row) => (
                    <tr key={row.name} className="border-b">
                        <td className="px-4 py-2 font-medium">{row.name}</td>
                        {periods.map((p) => (
                            <td
                                key={p}
                                className="px-4 py-2 text-right"
                            >
                                {Number(row[p] ?? 0).toLocaleString()}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
