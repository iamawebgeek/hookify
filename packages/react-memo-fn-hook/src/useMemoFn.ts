import * as React from 'react'
import shallowEqual from 'shallowequal'

export type HookOptions = {
  shallowDiffArgs?: boolean
}

export const useMemoFn = <T extends (...args: any[]) => any>(
  fn: T,
  dependencies: React.DependencyList,
  { shallowDiffArgs }: HookOptions = {},
) => {
  const argsWithResultsMapRef = React.useRef<Map<any[], ReturnType<T>>>(
    new Map(),
  )
  React.useEffect(() => {
    argsWithResultsMapRef.current = new Map()
  }, dependencies)
  return React.useCallback(
    (...args: Parameters<T>[]) => {
      const keys = argsWithResultsMapRef.current.keys()
      const compareFn = (arg, index) => {
        if (shallowDiffArgs) {
          return shallowEqual(args[index], arg)
        }
        return args[index] === arg
      }
      for (let memoArgs of keys) {
        if (memoArgs.length === args.length && memoArgs.every(compareFn)) {
          return argsWithResultsMapRef.current.get(memoArgs)
        }
      }
      const result = fn(...args)
      argsWithResultsMapRef.current.set(args, result)
      return result
    },
    [...dependencies, shallowDiffArgs],
  ) as T
}
