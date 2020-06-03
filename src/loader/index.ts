import bar from './bar'

/**
 * Determines the available loader types.
 */
export type LoaderType = 'bar'

/**
 * Determines the options of the loader.
 */
export interface LoaderOptions {
  /**
   * Determines the color of the loader.
   */
  color: string

  /**
   * Determines the size of the loader.
   */
  size: [number, number]

  /**
   * Determine the loader type.
   */
  type: LoaderType

  /**
   * Determines the text color of the loader.
   */
  textColor: string

  /**
   * Determine the text to show.
   */
  text: string
}

/**
 * Determines the available loaders.
 */
const loaders = {
  bar,
}

/**
 * Creates the loader given the options.
 */
export const loader = (options: LoaderOptions) => `
    <div class="chartisan-help-block">
        ${loaders[options.type](options)}
        ${
          options.text != ''
            ? `
                <div class="chartisan-help-text" style="color: ${options.textColor};">
                    ${options.text}
                </div>`
            : ''
        }
    </div>
`
