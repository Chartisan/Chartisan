import { Hooks } from './hooks'
import { mergeOptions } from './helpers'
import { isServerData, ServerData } from './data'
import { error, ErrorOptions } from './error/index'
import { loader, LoaderOptions } from './loader/index'

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
export interface ChartisanOptions<D>
    extends Omit<UpdateOptions, 'background' | 'additional'> {
    /**
     * Determines the DOM element element to
     * attach the chart to.
     *
     * @type {string}
     * @memberof ChartisanOptions
     */
    el?: string

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

    /**
     * Hooks that run before the render happens and that are
     * used to transform the data after the library has done
     * it's job.
     *
     * @memberof ChartisanOptions
     */
    hooks?: Hooks<D>
}

/**
 * Interface that denotes a class value.
 *
 * @export
 * @interface isChartisan
 * @template D
 */
export interface isChartisan<D> {
    new (options: ChartisanOptions<D>): Chartisan<D>
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
    url?: string

    /**
     * Determines the options of the request.
     * Replaces the old one.
     *
     * @type {RequestInit}
     * @memberof UpdateOptions
     */
    options?: RequestInit

    /**
     * Determines the data of the chart.
     * If set, no request will be performed as it
     * will be static data. If a function is provided,
     * the chart will display a loading message while
     * it resolves the data.
     *
     * @memberof UpdateOptions
     */
    data?: ServerData | (() => ServerData)

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
    background?: boolean

    /**
     * Store the additional options for the update function.
     *
     * @type {U}
     * @memberof UpdateOptions
     */
    additional?: U
}

/**
 * Modal options.
 *
 * @interface ModalOptions
 */
interface ModalOptions {
    /**
     * Determines if the modal should be shown or not.
     *
     * @type {boolean}
     * @memberof ModalOptions
     */
    show?: boolean

    /**
     * Determines the color of the modal background.
     *
     * @type {string}
     * @memberof ModalOptions
     */
    color?: string

    /**
     * Determines the contents to put in the loader.
     * It's mostly used to load some HTMl in the loader's
     * container.
     *
     * @type {string}
     * @memberof ModalOptions
     */
    content?: string
}

/**
 * Chartisan class
 *
 * @export
 * @abstract
 * @class Chartisan
 * @template D
 */
export abstract class Chartisan<D> {
    /**
     * Stores the chartisan options. The options
     * assigned here are the defaults and can be
     * overwritten given the constructor options.
     *
     * @protected
     * @type {ChartisanOptions}
     * @memberof Chartisan
     */
    protected options: ChartisanOptions<D> = {
        el: '.chart',
        url: undefined,
        options: undefined,
        data: undefined,
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
        },
        hooks: undefined
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
     * Represents the body where the chart is located.
     *
     * @protected
     * @type {HTMLDivElement}
     * @memberof Chartisan
     */
    protected body: HTMLDivElement

    /**
     * Represents the modal to show when loading
     * or showing a chart error.
     *
     * @protected
     * @type {HTMLDivElement}
     * @memberof Chartisan
     */
    protected modal: HTMLDivElement

    /**
     * Creates an instance of Chartisan.
     *
     * @param {ChartisanOptions} { identifier }
     * @memberof Chartisan
     */
    constructor(options: ChartisanOptions<D>) {
        const { el } = (this.options = { ...this.options, ...options })
        const element = document.querySelector(el!)
        if (!element)
            throw Error(
                `[Chartisan] Unable to find an element to bind the chart to a DOM element with the selector = '${el}'`
            )
        this.element = element
        this.controller = document.createElement('div')
        this.body = document.createElement('div')
        this.modal = document.createElement('div')
        this.bootstrap()
    }

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
    private setModal({
        show = true,
        color = '#FFFFFF',
        content
    }: ModalOptions) {
        this.modal.style.backgroundColor = color
        this.modal.style.display = show ? 'flex' : 'none'
        if (content) this.modal.innerHTML = content
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
                // this.body.innerHTML = loader(this.options.loader!)
                this.setModal({
                    show: true,
                    content: loader(this.options.loader!)
                })
                break
            }
            case ChartState.Show: {
                // this.body.innerHTML = ''
                this.setModal({ show: false })
                break
            }
            case ChartState.Error: {
                this.setModal({
                    show: true,
                    content: error(
                        this.options.error!,
                        err ?? new Error('Unknown Error')
                    )
                })
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
        // Append the controller and the modal
        // to the element.
        this.element.appendChild(this.controller)
        this.controller.appendChild(this.body)
        this.controller.appendChild(this.modal)
        // Append the classes to them.
        this.controller.classList.add('chartisan-controller')
        this.body.classList.add('chartisan-body')
        this.modal.classList.add('chartisan-modal')
        this.update(this.options)
    }

    /**
     * Requests the data to the server.
     *
     * @protected
     * @template U
     * @param {UpdateOptions<U>} [options]
     * @memberof Chartisan
     */
    protected request<U>(options?: UpdateOptions<U>) {
        if (!this.options.url)
            return this.onError(new Error('No URL provided to fetch the data.'))
        fetch(this.options.url!, this.options.options)
            .then(res => res.json())
            .then(res => this.onRawUpdate(res, options))
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
        refresh.addEventListener('click', () => this.update(), { once: true })
    }

    /**
     * Refresh the chart with new information.
     *
     * @param {boolean} [setLoading=true]
     * @memberof Chartisan
     */
    update<U>(options?: UpdateOptions<U>) {
        // Replace the configuration options.
        if (options?.url) this.options.url = options.url
        if (options?.options) this.options.options = options.options
        // Check to see if it's static data.
        if (options?.data) {
            // There's no need to request
            // new data from the server.
            let serverData: ServerData
            if (!isServerData(options.data)) {
                if (!options?.background) this.changeTo(ChartState.Loading)
                serverData = options.data()
            } else {
                serverData = options.data
            }
            const data = this.getDataFrom(serverData)
            this.changeTo(ChartState.Show)
            return options.background
                ? this.onBackgroundUpdate(data, options?.additional)
                : this.onUpdate(data, options?.additional)
        }
        if (!options?.background) this.changeTo(ChartState.Loading)
        this.request(options)
    }

    /**
     * Gets the data from a given request, applying
     * the hooks of the chart.
     *
     * @protected
     * @param {ServerData} response
     * @returns
     * @memberof Chartisan
     */
    protected getDataFrom(response: ServerData) {
        let data = this.formatData(response)
        if (this.options.hooks) {
            for (const hook of this.options.hooks.hooks) {
                data = hook(data, mergeOptions)
            }
        }
        return data
    }

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
    protected onRawUpdate<U>(response: JSON, options?: UpdateOptions<U>) {
        if (!isServerData(response))
            return this.onError(new Error('Invalid server data'))
        const data = this.getDataFrom(response)
        this.changeTo(ChartState.Show)
        options?.background
            ? this.onBackgroundUpdate(data, options?.additional)
            : this.onUpdate(data, options?.additional)
    }

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
    protected abstract formatData(response: ServerData): D

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
    protected abstract onUpdate<U>(data: D, options?: U): void

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
    protected abstract onBackgroundUpdate<U>(data: D, options?: U): void

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
