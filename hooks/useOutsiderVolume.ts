import { useState } from "react";
import { getOutsiderData } from "@/libs/api/outsiderApi";
import { mapOutsiderResponse } from "@/utils/mapOutsiderResponse";

export function useOutsiderVolume() {
    const [labels, setLabels] = useState<string[]>([]);
    const [periods, setPeriods] = useState<string[]>([]);
    const [wide, setWide] = useState([]);
    const [pivot, setPivot] = useState([]);

    async function load(codes: string[]) {
        if (codes.length === 0) return;

        const res = await getOutsiderData(codes);
        const mapped = mapOutsiderResponse(res);

        setLabels(mapped.labels);
        setPeriods(mapped.periods);
        setWide(mapped.wide);
        setPivot(mapped.pivot);
    }

    return {
        labels,
        periods,
        chartData: wide,
        pivot,
        load,
    };
}
