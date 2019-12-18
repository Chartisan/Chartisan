import { loader, LoaderOptions } from './loader/index'
import { error, ErrorOptions } from './error/index'
import { isServerData } from './data'

/**
 * Represents the states of the chart.
 *
 * @export
 * @enum {number}
 */
export enum ChartState {
    Initializing = 'initializing',
    Loading = 'loading',
    Error = 'error',
    Show = 'show'
}

/**
 * Represents the chartisan options.
 *
 * @export
 * @interface ChartisanOptions
 */
export interface ChartisanOptions {
    /**
     * Determines the DOM element element to
     * attach the chart to.
     *
     * @type {string}
     * @memberof ChartisanOptions
     */
    el?: string

    /**
     * Determines the chart URL.
     *
     * @type {string}
     * @memberof ChartisanOptions
     */
    url: string

    /**
     * Determines the options of the loader.
     *
     * @type {LoaderOptions}
     * @memberof ChartisanOptions
     */
    loader?: LoaderOptions

    /**
     * Determine the error options.
     *
     * @type {ErrorOptions}
     * @memberof ChartisanOptions
     */
    error?: ErrorOptions
}

/**
 * Interface that denotes a class value.
 *
 * @export
 * @interface isChartisan
 */
export interface isChartisan {
    new (options: ChartisanOptions): Chartisan
}

/**
 * Chartisan class
 *
 * @export
 * @class Chartisan
 */
export abstract class Chartisan {
    /**
     * Stores the chartisan options. The options
     * assigned here are the defaults and can be
     * overwritten given the constructor options.
     *
     * @protected
     * @type {ChartisanOptions}
     * @memberof Chartisan
     */
    protected options: ChartisanOptions = {
        el: '.chart',
        url: '',
        loader: {
            type: 'bar',
            size: [35, 35],
            color: '#000',
            text: 'Loading chart',
            textColor: '#a0aec0'
        },
        error: {
            type: 'general',
            size: [50, 50],
            color: '#f56565',
            text: 'There was an error',
            textColor: '#a0aec0',
            debug: true
        }
    }

    /**
     * Represents the DOM element to attach the chart to.
     *
     * @protected
     * @type {Element}
     * @memberof Chartisan
     */
    protected element: Element

    /**
     * Stores the HTML element that takes the control
     * of the chart. It's always a child of element
     *
     * @protected
     * @type {Element}
     * @memberof Chartisan
     */
    protected controller: HTMLDivElement

    /**
     * State of the chart.
     *
     * @protected
     * @type {ChartState}
     * @memberof Chartisan
     */
    protected cstate: ChartState = ChartState.Initializing

    /**
     * Creates an instance of Chartisan.
     *
     * @param {ChartisanOptions} { identifier }
     * @memberof Chartisan
     */
    constructor(options: ChartisanOptions) {
        const { el } = (this.options = { ...this.options, ...options })
        const element = document.querySelector(el!)
        if (!element)
            throw Error(
                `[Chartisan] Unable to find an element to bind the chart to a DOM element with the selector = '${el}'`
            )
        this.element = element
        this.controller = document.createElement('div')
        this.bootstrap()
    }

    /**
     * Changes the status of the chart.
     *
     * @protected
     * @param {ChartState} state
     * @memberof Chartisan
     */
    protected changeTo(state: ChartState, err?: Error) {
        switch (state) {
            case (ChartState.Initializing, ChartState.Loading): {
                this.controller.innerHTML = loader(this.options.loader!)
                break
            }
            case ChartState.Show: {
                this.controller.innerHTML = ''
                break
            }
            case ChartState.Error: {
                this.controller.innerHTML = error(
                    this.options.error!,
                    err ?? new Error('Unknown Error')
                )
                this.refreshEvent()
                break
            }
        }
        this.cstate = state
    }

    /**
     * Bootstraps the chart.
     *
     * @protected
     * @memberof Chartisan
     */
    protected bootstrap() {
        // Append the controller to the element.
        this.element.appendChild(this.controller)
        // Append the chartisan class to it.
        this.controller.classList.add('chartisan')
        this.request()
    }

    /**
     * Requests the data to the server.
     *
     * @protected
     * @memberof Chartisan
     */
    protected request() {
        this.changeTo(ChartState.Loading)
        fetch(this.options.url)
            .then(res => res.json())
            .then(res => this.onRawUpdate(res))
            .catch(err => this.onError(err))
    }

    /**
     * Attaches the refresh event handler to the icon.
     *
     * @protected
     * @memberof Chartisan
     */
    protected refreshEvent() {
        const refresh = this.controller.getElementsByClassName(
            'chartisan-refresh-chart'
        )[0]
        refresh.addEventListener('click', () => this.refresh(), { once: true })
    }

    /**
     * Refresh the chart with new information.
     *
     * @memberof Chartisan
     */
    refresh() {
        this.request()
    }

    /**
     * Called when the data is correctly recieved from
     * the server. This method calls onUpdate() internally.
     *
     * @protected
     * @param {JSON} response
     * @memberof Chartisan
     */
    protected onRawUpdate(response: JSON) {
        // Check if the response is OK.
        if (!isServerData(response))
            return this.onError(new Error('Invalid server data'))
        this.changeTo(ChartState.Show)
        this.onUpdate(response)
    }

    /**
     * Handles a successfull response of the chart data.
     *
     * @protected
     * @abstract
     * @param {JSON} response
     * @memberof Chartisan
     */
    protected abstract onUpdate(response: JSON): void

    /**
     * Handles an error when getting the data of the chart.
     *
     * @protected
     * @param {Error} error
     * @memberof Chartisan
     */
    protected onError(err: Error) {
        this.changeTo(ChartState.Error, err)
    }

    /**
     * Returns the current chart state.
     *
     * @returns {ChartState}
     * @memberof Chartisan
     */
    state(): ChartState {
        return this.cstate
    }
}
