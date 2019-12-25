/**
 * Stores the hooks.
 *
 * @export
 * @type {Hook}
 */
export declare type Hook<D> = (data: D) => D;
/**
 * Determines the interface of a hook
 * constructor.
 *
 * @export
 * @interface isHook
 * @template D
 */
export interface isHook<D> {
    new (): Hooks<D>;
}
/**
 * Represents the hooks of the chart.
 *
 * @export
 * @class Hooks
 * @template D
 */
export declare class Hooks<D> {
    /**
     * Stores the hooks.
     *
     * @type {Hook<D>[]}
     * @memberof Hooks
     */
    hooks: Hook<D>[];
}
