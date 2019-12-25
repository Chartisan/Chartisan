import merge from 'deepmerge'

/**
 * Stores the default color palette.
 *
 * @export
 * @type {string[]}
 */
export const colorPalette = [
    '#667EEA',
    '#F56565',
    '#48BB78',
    '#ED8936',
    '#9F7AEA',
    '#38B2AC',
    '#ECC94B',
    '#4299E1',
    '#ED64A6'
]

/**
 * Used to merge different nested options.
 *
 * @export
 * @type {typeof merge}
 */
export const mergeOptions = merge
