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
export interface ChartisanOptions<D> extends Omit<UpdateOptions, 'background' | 'additional'> {
    /**
     * Determines the DOM element element to
     * attach the chart to.
     *
     * @type {string}
     * @memberof ChartisanOptions
     */
    el?: string;
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
 * Options to update the chart.
 *
 * @export
 * @interface UpdateOptions
 * @template U
 */
export interface UpdateOptions<U = {}> {
    /**
     * Determines the request url.
     * Replaces the old one.
     *
     * @type {string}
     * @memberof UpdateOptions
     */
    url?: string;
    /**
     * Determines the options of the request.
     * Replaces the old one.
     *
     * @type {RequestInit}
     * @memberof UpdateOptions
     */
    options?: RequestInit;
    /**
     * Determines the data of the chart.
     * If set, no request will be performed as it
     * will be static data. If a function is provided,
     * the chart will display a loading message while
     * it resolves the data.
     *
     * @memberof UpdateOptions
     */
    data?: ServerData | (() => ServerData);
    /**
     * Loads the data in the chart in the background,
     * without any visual feedback to the user, this is
     * used to perform updates without displaying the
     * "Loading chart" text and therefore, without re-creating
     * the chart.
     *
     * @type {boolean}
     * @memberof UpdateOptions
     */
    background?: boolean;
    /**
     * Store the additional options for the update function.
     *
     * @type {U}
     * @memberof UpdateOptions
     */
    additional?: U;
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
     * Represents the body where the chart is located.
     *
     * @protected
     * @type {HTMLDivElement}
     * @memberof Chartisan
     */
    protected body: HTMLDivElement;
    /**
     * Represents the modal to show when loading
     * or showing a chart error.
     *
     * @protected
     * @type {HTMLDivElement}
     * @memberof Chartisan
     */
    protected modal: HTMLDivElement;
    /**
     * Creates an instance of Chartisan.
     *
     * @param {ChartisanOptions} { identifier }
     * @memberof Chartisan
     */
    constructor(options: ChartisanOptions<D>);
    /**
     * Set he modal settings.
     *
     * @private
     * @param {ModalOptions} {
     *         show = true,
     *         color = '#FFFFFF',
     *         content
     *     }
     * @memberof Chartisan
     */
    private setModal;
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
     * @template U
     * @param {UpdateOptions<U>} [options]
     * @memberof Chartisan
     */
    protected request<U>(options?: UpdateOptions<U>): void;
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
    update<U>(options?: UpdateOptions<U>): void;
    /**
     * Gets the data from a given request, applying
     * the hooks of the chart.
     *
     * @protected
     * @param {ServerData} response
     * @returns
     * @memberof Chartisan
     */
    protected getDataFrom(response: ServerData): D;
    /**
     * Called when the data is correctly recieved from
     * the server. This method calls onUpdate() internally.
     *
     * @protected
     * @template U
     * @param {JSON} response
     * @param {UpdateOptions<U>} [options]
     * @returns
     * @memberof Chartisan
     */
    protected onRawUpdate<U>(response: JSON, options?: UpdateOptions<U>): void;
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
     * @template U
     * @param {D} data
     * @param {U} [options]
     * @memberof Chartisan
     */
    protected abstract onUpdate<U>(data: D, options?: U): void;
    /**
     * Called when the chart has to be updated from
     * the background, without creating a new chart instance.
     *
     * @protected
     * @abstract
     * @template U
     * @param {D} data
     * @param {U} [options]
     * @memberof Chartisan
     */
    protected abstract onBackgroundUpdate<U>(data: D, options?: U): void;
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
