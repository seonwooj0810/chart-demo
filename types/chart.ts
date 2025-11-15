export interface WideRow {
    [key: string]: number | string;
}

export interface PivotRow {
    name: string;
    [period: string]: number | string;
}
