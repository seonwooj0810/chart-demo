import { OutsiderResponse } from "@/types/outsider";

export async function getOutsiderData(codes: string[]): Promise<OutsiderResponse> {
    const query = codes.map((v) => `bjdCode=${v}`).join("&");

    const res = await fetch(
        `http://localhost:8080/v1/trade/volume/outsider?${query}&startMonth=202401&endMonth=202501`
    );

    const json = await res.json();
    return json.data;
}
