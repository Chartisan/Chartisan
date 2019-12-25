import { Hooks } from './hooks';
import { ServerData } from './data';
import { ErrorOptions } from './error/index';
import { LoaderOptions } from './loader/index';
/**
 * Represents the states of the chart.
 *
 * @export
 * @enum {number}
 */
export declare enum ChartState {
    Initializing = "initializing",
    Loading = "loading",
    Error = "error",
    Show = "show"
}
/**
 * Represents the chartisan options.
 *
 * @export
 * @interface ChartisanOptions
 */
export interface ChartisanOptions<D> {
    /**
     * Determines the DOM element element to
     * attach the chart to.
     *
     * @type {string}
     * @memberof ChartisanOptions
     */
    el?: string;
    /**
     * Determines the chart URL.
     *
     * @type {string}
     * @memberof ChartisanOptions
     */
    url: string;
    /**
     * Determines the options of the loader.
     *
     * @type {LoaderOptions}
     * @memberof ChartisanOptions
     */
    loader?: LoaderOptions;
    /**
     * Determine the error options.
     *
     * @type {ErrorOptions}
     * @memberof ChartisanOptions
     */
    error?: ErrorOptions;
    /**
     * Hooks that run before the render happens and that are
     * used to transform the data after the library has done
     * it's job.
     *
     * @memberof ChartisanOptions
     */
    hooks?: Hooks<D>;
}
/**
 * Interface that denotes a class value.
 *
 * @export
 * @interface isChartisan
 * @template D
 */
export interface isChartisan<D> {
    new (options: ChartisanOptions<D>): Chartisan<D>;
}
/**
 * Chartisan class
 *
 * @export
 * @abstract
 * @class Chartisan
 * @template D
 */
export declare abstract class Chartisan<D> {
    /**
     * Stores the chartisan options. The options
     * assigned here are the defaults and can be
     * overwritten given the constructor options.
     *
     * @protected
     * @type {ChartisanOptions}
     * @memberof Chartisan
     */
    protected options: ChartisanOptions<D>;
    /**
     * Represents the DOM element to attach the chart to.
     *
     * @protected
     * @type {Element}
     * @memberof Chartisan
     */
    protected element: Element;
    /**
     * Stores the HTML element that takes the control
     * of the chart. It's always a child of element
     *
     * @protected
     * @type {Element}
     * @memberof Chartisan
     */
    protected controller: HTMLDivElement;
    /**
     * State of the chart.
     *
     * @protected
     * @type {ChartState}
     * @memberof Chartisan
     */
    protected cstate: ChartState;
    /**
     * Creates an instance of Chartisan.
     *
     * @param {ChartisanOptions} { identifier }
     * @memberof Chartisan
     */
    constructor(options: ChartisanOptions<D>);
    /**
     * Changes the status of the chart.
     *
     * @protected
     * @param {ChartState} state
     * @memberof Chartisan
     */
    protected changeTo(state: ChartState, err?: Error): void;
    /**
     * Bootstraps the chart.
     *
     * @protected
     * @memberof Chartisan
     */
    protected bootstrap(): void;
    /**
     * Requests the data to the server.
     *
     * @protected
     * @param {boolean} [setLoading=true]
     * @memberof Chartisan
     */
    protected request(setLoading?: boolean): void;
    /**
     * Attaches the refresh event handler to the icon.
     *
     * @protected
     * @memberof Chartisan
     */
    protected refreshEvent(): void;
    /**
     * Refresh the chart with new information.
     *
     * @param {boolean} [setLoading=true]
     * @memberof Chartisan
     */
    refresh(setLoading?: boolean): void;
    /**
     * Called when the data is correctly recieved from
     * the server. This method calls onUpdate() internally.
     *
     * @protected
     * @param {JSON} response
     * @memberof Chartisan
     */
    protected onRawUpdate(response: JSON): void;
    /**
     * Formats the data of the request to match the data that
     * the chart needs (acording to the desired front-end).
     *
     * @protected
     * @abstract
     * @param {ServerData} response
     * @returns {D}
     * @memberof Chartisan
     */
    protected abstract formatData(response: ServerData): D;
    /**
     * Handles a successfull response of the chart data.
     *
     * @protected
     * @abstract
     * @param {D} data
     * @memberof Chartisan
     */
    protected abstract onUpdate(data: D): void;
    /**
     * Handles an error when getting the data of the chart.
     *
     * @protected
     * @param {Error} error
     * @memberof Chartisan
     */
    protected onError(err: Error): void;
    /**
     * Returns the current chart state.
     *
     * @returns {ChartState}
     * @memberof Chartisan
     */
    state(): ChartState;
}
