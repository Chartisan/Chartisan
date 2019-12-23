/**
 * Determines the available loader types.
 *
 * @export
 * @type LoaderType
 */
export declare type LoaderType = 'bar';
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
    color: string;
    /**
     * Determines the size of the loader.
     *
     * @type {[number, number]}
     * @memberof LoaderOptions
     */
    size: [number, number];
    /**
     * Determine the loader type.
     *
     * @type {LoaderType}
     * @memberof LoaderOptions
     */
    type: LoaderType;
    /**
     * Determines the text color of the loader.
     *
     * @type {string}
     * @memberof LoaderOptions
     */
    textColor: string;
    /**
     * Determine the text to show.
     *
     * @type {string}
     * @memberof LoaderOptions
     */
    text: string;
}
/**
 * Creates the loader given the options.
 *
 * @export
 * @param {LoaderOptions} { color, size, type, textColor }
 */
export declare const loader: (options: LoaderOptions) => string;
