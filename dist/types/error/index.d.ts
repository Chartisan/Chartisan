export declare type ErrorType = 'general';
/**
 * Determine the error options.
 *
 * @export
 * @interface ErrorOptions
 */
export interface ErrorOptions {
    color: string;
    text: string;
    size: [number, number];
    textColor: string;
    type: ErrorType;
    debug: boolean;
}
export declare const error: (options: ErrorOptions, error: Error) => string;
