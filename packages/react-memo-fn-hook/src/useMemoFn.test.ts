import { renderHook } from '@testing-library/react-hooks'

import { useMemoFn } from './useMemoFn'

describe('useMemoFn hook', () => {
  describe('no dependencies, no shallow comparison', () => {
    it('memos result of a function by given a primitive type param', () => {
      const { result } = renderHook(
        () => useMemoFn((number) => number * Math.random(), []),
        {},
      )
      const firstCall = result.current(5)
      const secondCall = result.current(5)
      const thirdCall = result.current(6)
      const forthCall = result.current(6)
      expect(firstCall).toBe(secondCall)
      expect(thirdCall).toBe(forthCall)
      expect(firstCall).not.toBe(thirdCall)
    })

    it('doesnt memo result of a function by given non-primitive params', () => {
      const { result } = renderHook(
        () =>
          useMemoFn(
            ([start, end], { key }) => ({
              [key]: start * Math.random() + (end - start) * Math.random(),
            }),
            [],
          ),
        {},
      )
      const param1 = [50, 100]
      const param2 = { key: 'rand' }
      const firstCall = result.current(param1, param2)
      const secondCall = result.current(param1, param2)
      const thirdCall = result.current([25, 50], param2)
      const fourthCall = result.current(param1, { key: 'rand' })
      expect(firstCall).toBe(secondCall)
      expect(firstCall).not.toBe(thirdCall)
      expect(firstCall).not.toBe(fourthCall)
      expect(secondCall).not.toBe(thirdCall)
      expect(secondCall).not.toBe(fourthCall)
      expect(thirdCall).not.toBe(fourthCall)
    })
  })

  describe('with dependencies, no shallow comparison', () => {
    it('memos result of a function by given primitive type params and resets on dependencies change', () => {
      const { result, rerender } = renderHook(
        (props) =>
          useMemoFn(
            (number) => props.base * number * Math.random(),
            [props.base],
          ),
        {
          initialProps: { base: 1 },
        },
      )
      const firstCall = result.current(5)
      rerender({ base: 2 })
      const secondCall = result.current(5)
      expect(firstCall).not.toBe(secondCall)
    })
  })

  describe('with dependencies, with shallow comparison', () => {
    it('memos result of a function by given non-primitive type params', () => {
      const { result } = renderHook(
        () =>
          useMemoFn(
            ([start, end], { key }) => ({
              [key]: start * Math.random() + (end - start) * Math.random(),
            }),
            [],
            { shallowDiffArgs: true },
          ),
        {},
      )
      const param1 = [50, 100]
      const param2 = { key: 'rand' }
      const firstCall = result.current(param1, param2)
      const secondCall = result.current([50, 100], { key: 'rand' })
      const thirdCall = result.current([25, 50], { key: 'nand' })
      expect(firstCall).toBe(secondCall)
      expect(firstCall).not.toBe(thirdCall)
      expect(secondCall).not.toBe(thirdCall)
    })
  })
})
