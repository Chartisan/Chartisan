/**
 * Represents the chart data.
 *
 * @export
 * @interface ChartData
 */
export interface ChartData {
    /**
     * Stores the chart labels.
     *
     * @type {string[]}
     * @memberof ChartData
     */
    labels: string[]

    /**
     * Stores the chart options.
     *
     * @type {*}
     * @memberof ChartData
     */
    options: any
}

/**
 * Determines if the given object satisfies ChartData.
 *
 * @export
 * @param {*} obj
 * @returns {obj is ChartData}
 */
export function isChartData(obj: any): obj is ChartData {
    return 'labels' in obj && 'options' in obj
}

/**
 * Determine the dataset data.
 *
 * @export
 * @interface DatasetData
 */
export interface DatasetData {
    /**
     * Stores the dataset name.
     *
     * @type {string}
     * @memberof DatasetData
     */
    name: string

    /**
     * Stores the dataset type.
     *
     * @type {string}
     * @memberof DatasetData
     */
    type: string

    /**
     * Stores the dataset values.
     *
     * @type {((string | number)[])}
     * @memberof DatasetData
     */
    values: (string | number)[]

    /**
     * Stores the dataset options.
     *
     * @type {*}
     * @memberof DatasetData
     */
    options: any
}

/**
 * Determines if obj satisfies ChartData.
 *
 * @export
 * @param {*} obj
 * @returns {obj is ChartData}
 */
export function isDatasetData(obj: any): obj is ChartData {
    return 'name' in obj && 'type' in obj && 'values' in obj && 'options' in obj
}

/**
 * Represents the server data.
 *
 * @export
 * @interface ServerData
 */
export interface ServerData {
    /**
     * Stores the chart data.
     *
     * @type {ChartData}
     * @memberof ServerData
     */
    chart: ChartData

    /**
     * Stores the datasets.
     *
     * @type {DatasetData[]}
     * @memberof ServerData
     */
    datasets: DatasetData[]
}

/**
 * Determine if the given object satisfies ServerData.
 *
 * @export
 * @param {*} obj
 * @returns {obj is ServerData}
 */
export function isServerData(obj: any): obj is ServerData {
    return (
        'chart' in obj &&
        'datasets' in obj &&
        isChartData(obj.chart) &&
        obj.datasets.every((d: any) => isDatasetData(d))
    )
}
