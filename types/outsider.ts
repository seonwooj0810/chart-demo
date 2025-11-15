export interface OutsiderSeries {
    name: string;
    values: number[];
}

export interface OutsiderResponse {
    periods: string[];
    labels: string[];
    series: OutsiderSeries[];
}
