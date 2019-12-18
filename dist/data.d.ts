export interface ChartData {
    labels: string[];
    options: any;
}
export declare function isChartData(obj: any): obj is ChartData;
export interface DatasetData {
    name: string;
    type: string;
    values: (string | number)[];
    options: any;
}
export declare function isDatasetData(obj: any): obj is ChartData;
export interface ServerData {
    chart: ChartData;
    datasets: DatasetData[];
}
export declare function isServerData(obj: any): obj is ServerData;
