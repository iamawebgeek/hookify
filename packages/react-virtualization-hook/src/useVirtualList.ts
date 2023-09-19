import * as React from 'react'
import ResizeObserver from 'resize-observer-polyfill'

type State = {
  shownFrom: number
  shownTo: number
}

export type HookOptions = {
  itemHeight: number
  totalItems: number
  showOffscreenTop?: number
  showOffscreenBottom?: number
}

export type Hook<
  CP extends React.HTMLProps<Element>,
  WP extends React.HTMLProps<Element>,
> = {
  state: State
  containerProps: (
    props?: CP,
  ) => CP &
    Required<Pick<React.HTMLProps<Element>, 'ref' | 'onScroll' | 'style'>>
  wrapperProps: (props?: WP) => WP & Pick<React.HTMLProps<Element>, 'style'>
}

export function useVirtualList<
  CP extends React.HTMLProps<Element> = React.HTMLProps<any>,
  WP extends React.HTMLProps<Element> = React.HTMLProps<any>,
>({
  itemHeight,
  showOffscreenBottom = 0,
  showOffscreenTop = 0,
  totalItems,
}: HookOptions): Hook<CP, WP> {
  const elementRef = React.useRef<Element>()
  const [state, dispatch] = React.useReducer<React.ReducerWithoutAction<State>>(
    (state) => {
      const element = elementRef.current
      if (element) {
        const capacity = Math.ceil(element.clientHeight / itemHeight)
        const offset = Math.floor(element.scrollTop / itemHeight) + 1
        const from = offset - showOffscreenTop
        const to = offset + capacity + showOffscreenBottom - 1
        const newState: State = {
          shownFrom: from < 1 ? 1 : from,
          shownTo: to > totalItems ? totalItems : to,
        }
        if (
          Object.entries(state).some(
            ([key, value]) => newState[key as keyof State] !== value,
          )
        ) {
          return newState
        }
      }
      return state
    },
    { shownFrom: 1, shownTo: 1 },
  )

  React.useEffect(() => {
    dispatch()
  }, [itemHeight, showOffscreenTop, showOffscreenBottom, totalItems])

  React.useEffect(() => {
    const element = elementRef.current
    if (totalItems > 0 && element) {
      const observer = new ResizeObserver(() => {
        dispatch()
      })
      observer.observe(element)
      return () => observer.disconnect()
    }
  }, [totalItems])

  function calculateStyles() {
    return {
      height: totalItems * itemHeight,
      paddingTop: (state.shownFrom - 1) * itemHeight,
    }
  }

  return {
    state,
    containerProps: (props) => ({
      ...(props as CP),
      ref: (current) => {
        if (props?.ref) {
          if (typeof props.ref === 'function') {
            props.ref(current)
          }
          if ((props.ref as React.MutableRefObject<any>).current) {
            ;(props.ref as React.MutableRefObject<any>).current = current
          }
        }
        elementRef.current = current!
      },
      onScroll: (event) => {
        props?.onScroll && props.onScroll(event)
        dispatch()
      },
      style: {
        ...props?.style,
        overflowY: 'auto',
      },
    }),
    wrapperProps: (props) => ({
      ...(props as WP),
      style: {
        ...props?.style,
        width: '100%',
        boxSizing: 'border-box',
        ...calculateStyles(),
      },
    }),
  }
}
