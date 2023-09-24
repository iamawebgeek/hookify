import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'

let config = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      interop: 'compat',
      sourceMap: true,
    },
    {
      file: 'dist/index.es.js',
      format: 'es',
      sourceMap: true,
    },
  ],
  plugins: [
    typescript({
      include: './**/*.ts(|x)',
      cacheRoot: 'node_modules/.cache'
    }),
    commonjs({
      include: './**/*',
      extensions: ['.js', '.ts', '.tsx'],
    }),
  ],
}

export default config
