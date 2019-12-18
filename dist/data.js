export function isChartData(obj) {
    return 'labels' in obj && 'options' in obj;
}
export function isDatasetData(obj) {
    return 'name' in obj && 'type' in obj && 'values' in obj && 'options' in obj;
}
export function isServerData(obj) {
    return ('chart' in obj &&
        'datasets' in obj &&
        isChartData(obj.chart) &&
        obj.datasets.every((d) => isDatasetData(d)));
}
