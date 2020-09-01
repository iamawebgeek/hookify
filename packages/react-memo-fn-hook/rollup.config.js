import config from '../../rollup.config'
import pkg from './package.json'

export default {
  ...config,
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
}