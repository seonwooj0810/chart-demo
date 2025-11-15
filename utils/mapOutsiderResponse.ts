import { WideRow, PivotRow } from "@/types/chart";
import { OutsiderResponse } from "@/types/outsider";

export function mapOutsiderResponse(data: OutsiderResponse) {
    const { periods, labels, series } = data;

    const wide: WideRow[] = periods.map((period, idx) => {
        const row: WideRow = { "기간": period };
        series.forEach((s) => {
            row[s.name] = s.values[idx];
        });
        return row;
    });

    const pivot: PivotRow[] = series.map((s) => {
        const row: PivotRow = { name: s.name };
        periods.forEach((p, idx) => {
            row[p] = s.values[idx];
        });
        return row;
    });

    return { wide, pivot, periods, labels };
}
