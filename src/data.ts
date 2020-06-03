/**
 * Determines how the extra data looks like.
 */
export interface ExtraData {
  [key: string]: unknown
}

/**
 * Represents the chart data.
 */
export interface ChartData {
  /**
   * Stores the chart labels.
   */
  labels: string[]

  /**
   * Stores the chart extra options.
   */
  extra?: ExtraData
}

/**
 * Determines if the given object satisfies ChartData.
 */
export function isChartData(obj: any): obj is ChartData {
  return 'labels' in obj
}

/**
 * Determine the dataset data.
 */
export interface DatasetData {
  /**
   * Stores the dataset name.
   */
  name: string

  /**
   * Stores the dataset values.
   */
  values: number[]

  /**
   * Stores the dataset extra options.
   */
  extra?: ExtraData
}

/**
 * Determines if obj satisfies ChartData.
 */
export function isDatasetData(obj: any): obj is DatasetData {
  return 'name' in obj && 'values' in obj
}

/**
 * Represents the server data.
 */
export interface ServerData {
  /**
   * Stores the chart data.
   */
  chart: ChartData

  /**
   * Stores the datasets.
   */
  datasets: DatasetData[]
}

/**
 * Determine if the given  object satisfies ServerData.
 */
export function isServerData(obj: any): obj is ServerData {
  return (
    'chart' in obj && 'datasets' in obj && isChartData(obj.chart) && obj.datasets.every((d: any) => isDatasetData(d))
  )
}
