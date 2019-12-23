import gzip from 'rollup-plugin-gzip'
// import ts from '@wessberg/rollup-plugin-ts'
import { terser } from 'rollup-plugin-terser'
import commonjs from 'rollup-plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { peerDependencies } from './package.json'
// import typescript from '@rollup/plugin-typescript'
// import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import { DEFAULT_EXTENSIONS } from '@babel/core'

const extensions = [...DEFAULT_EXTENSIONS, '.ts', '.tsx']

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
        typescript({ useTsconfigDeclarationDir: true }),
        resolve({ extensions }),
        commonjs({ include: 'node_modules/**' }),
        // babel({ extensions, include: ['src/**/*'] }),
        ...(process.env.BUILD === 'production' ? [terser(), gzip()] : [])
    ]
}
