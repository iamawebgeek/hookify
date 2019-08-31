import * as React from 'react'
import ResizeObserver from 'resize-observer-polyfill'

type Props = React.AllHTMLAttributes<HTMLElement> & React.ClassAttributes<any>

type State = {
  shownFrom: number
  shownTo: number
}

export type HookOptions = {
  itemHeight: number
  totalItems: number
  showOffscreenTop: number
  showOffscreenBottom: number
}

export type Hook = {
  state: State
  containerProps: (props?: Props) => Props
  wrapperProps: (props?: Props) => Props
}

export function useVirtualList(options: HookOptions): Hook {
  const elementRef = React.useRef<HTMLElement>()
  const [state, dispatch] = React.useReducer(
    (state) => {
      const element = elementRef.current
      if (element) {
        const capacity = Math.ceil(element.clientHeight / options.itemHeight)
        const offset = Math.floor(element.scrollTop / options.itemHeight) + 1
        const from = offset - options.showOffscreenTop
        const to = offset + capacity + options.showOffscreenBottom
        const newState = {
          shownFrom: from < 1 ? 1 : from,
          shownTo: to > options.totalItems ? options.totalItems : to,
        }
        if (
          Object.entries(state).some(([key, value]) => newState[key] !== value)
        ) {
          return newState
        }
      }
      return state
    },
    { shownFrom: 1, shownTo: 1 },
  )

  React.useEffect(() => {
    dispatch(null)
  }, Object.values(options))

  React.useEffect(() => {
    const observer = new ResizeObserver(() => {
      dispatch(null)
    })
    observer.observe(elementRef.current!)
    return observer.disconnect
  }, [])

  function calculateStyles() {
    return {
      height: options.totalItems * options.itemHeight,
      paddingTop: (state.shownFrom - 1) * options.itemHeight,
    }
  }

  return {
    state,
    containerProps: (props = {}) => ({
      ...props,
      ref: (current) => {
        if (props.ref) {
          if (typeof props.ref === 'function') {
            props.ref(current)
          }
          if ((props.ref as React.MutableRefObject<any>).current) {
            ;(props.ref as React.MutableRefObject<any>).current = current
          }
        }
        elementRef.current = current
      },
      onScroll: (event) => {
        props.onScroll && props.onScroll(event)
        dispatch(null)
      },
      style: {
        ...props.style,
        overflowY: 'auto',
      },
    }),
    wrapperProps: (props = {}) => ({
      ...props,
      style: {
        ...props.style,
        width: '100%',
        boxSizing: 'border-box',
        ...calculateStyles(),
      },
    }),
  }
}
