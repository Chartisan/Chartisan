import gzip from 'rollup-plugin-gzip'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import commonjs from 'rollup-plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { peerDependencies } from './package.json'
import typescript from 'rollup-plugin-typescript2'

const extensions = ['.js', '.mjs', '.jsx', '.es6', '.es', '.ts', '.tsx']

export default {
    input: 'src/index.ts',
    output: [
        {
            file: `dist/chartisan.js`,
            format: 'esm',
            name: 'chartisan',
            globals: {
                deepmerge: 'merge'
            }
        }
    ],
    external: [...Object.keys(peerDependencies || {})],
    plugins: [
        postcss(),
        typescript({ useTsconfigDeclarationDir: true }),
        resolve({ extensions }),
        commonjs({ include: 'node_modules/**' }),
        ...(process.env.BUILD === 'production' ? [terser(), gzip()] : [])
    ]
}
