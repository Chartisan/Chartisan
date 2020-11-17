import { LoaderOptions } from './index'

/**
 * The infinite loader.
 */
export default ({ size, color }: LoaderOptions) => `
    <svg width="${size[0]}" height="${size[1]}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke="${color}" stroke-width="8" stroke-dasharray="42 42" d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z" stroke-linecap="round">
            <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0;256"></animate>
        </path>
    </svg>
`
