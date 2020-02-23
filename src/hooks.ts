import { mergeOptions } from './helpers'
import { ServerData } from './data'

/**
 * Determines the parameters that the hooks can take.
 *
 * @export
 * @interface HookParams
 * @template D
 */
export interface HookParams<D> {
    /**
     * Determines the data of the hook.
     *
     * @memberof HookParams
     */
    data: D

    /**
     * Passes a merge option.
     *
     * @memberof HookParams
     */
    merge: typeof mergeOptions

    /**
     * Determines the server data in case
     * extra information is needed.
     *
     * @memberof HookParams
     */
    server: ServerData
}

/**
 * Determines a hook type.
 *
 * @export
 * @type {Hook}
 */
export type Hook<D> = (params: HookParams<D>) => D

/**
 * Determines the interface of a hook
 * constructor.
 *
 * @export
 * @interface isHook
 * @template D
 */
export interface isHook<D> {
    new (): Hooks<D>
}

/**
 * Represents the hooks of the chart.
 *
 * @export
 * @class Hooks
 * @template D
 */
export class Hooks<D> {
    /**
     * Stores the hooks.
     *
     * @type {Hook<D>[]}
     * @memberof Hooks
     */
    hooks: Hook<D>[] = []

    /**
     * Appends a custom hook
     *
     * @param {Hook<D>} hook
     * @returns {this}
     * @memberof Hooks
     */
    custom(hook: Hook<D>): this {
        this.hooks.push(hook)
        return this
    }

    /**
     * Merges the given options to the chart.
     *
     * @param {D} options
     * @returns {this}
     * @memberof Hooks
     */
    options(options: D): this {
        return this.custom(({ data, merge }) => merge(data, options))
    }

    /**
     * Merges the given hooks with the current ones.
     *
     * @param {Hooks<D>} other
     * @returns {this}
     * @memberof Hooks
     */
    merge(other: Hooks<D>): this {
        this.hooks = [...this.hooks, ...other.hooks]
        return this
    }
}
