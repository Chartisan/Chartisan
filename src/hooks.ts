import { mergeOptions } from './helpers'
import { ServerData } from './data'

/**
 * Determines the parameters that the hooks can take.
 */
export interface HookParams<D> {
  /**
   * Determines the data of the hook.
   */
  data: D

  /**
   * Passes a merge option.
   */
  merge: typeof mergeOptions

  /**
   * Determines the server data in case
   * extra information is needed.
   */
  server: ServerData
}

/**
 * Determines a hook type.
 */
export type Hook<D> = (params: HookParams<D>) => D

/**
 * Determines the interface of a hook
 * constructor.
 */
export interface isHook<D> {
  new (): Hooks<D>
}

/**
 * Represents the hooks of the chart.
 */
export class Hooks<D> {
  /**
   * Stores the hooks.
   */
  hooks: Hook<D>[] = []

  /**
   * Appends a custom hook
   */
  custom(hook: Hook<D>): this {
    this.hooks.push(hook)
    return this
  }

  /**
   * Merges the given options to the chart.
   */
  options(options: D): this {
    return this.custom(({ data, merge }) => merge(data, options))
  }

  /**
   * Merges the given hooks with the current ones.
   */
  merge(other: Hooks<D>): this {
    this.hooks = [...this.hooks, ...other.hooks]
    return this
  }
}
