import bar from './bar'

/**
 * Determines the available loader types.
 *
 * @export
 * @type LoaderType
 */
export type LoaderType = 'bar'

/**
 * Determines the options of the loader.
 *
 * @export
 * @interface LoaderOptions
 */
export interface LoaderOptions {
    /**
     * Determines the color of the loader.
     *
     * @type {string}
     * @memberof LoaderOptions
     */
    color: string

    /**
     * Determines the size of the loader.
     *
     * @type {[number, number]}
     * @memberof LoaderOptions
     */
    size: [number, number]

    /**
     * Determine the loader type.
     *
     * @type {LoaderType}
     * @memberof LoaderOptions
     */
    type: LoaderType

    /**
     * Determines the text color of the loader.
     *
     * @type {string}
     * @memberof LoaderOptions
     */
    textColor: string

    /**
     * Determine the text to show.
     *
     * @type {string}
     * @memberof LoaderOptions
     */
    text: string
}

/**
 * Determines the available loaders.
 *
 * @type {string}
 * @memberof LoaderOptions
 */
const loaders = {
    bar
}

/**
 * Creates the loader given the options.
 *
 * @export
 * @param {LoaderOptions} { color, size, type, textColor }
 */
export const loader = (options: LoaderOptions) => `
    <div class="chartisan-help-block">
        ${loaders[options.type](options)}
        ${
            options.text != ''
                ? `
                    <div class="chartisan-help-text" style="color: ${options.textColor};">
                        ${options.text}
                    </div>
                `
                : ''
        }
    </div>
`
