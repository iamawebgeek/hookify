import { renderHook } from '@testing-library/react-hooks'
import { render, fireEvent, screen } from '@testing-library/react'
import * as React from 'react'

import { HookOptions, useVirtualList } from './useVirtualList'

const getHook = (props: HookOptions) => {
  return renderHook(() => useVirtualList(props), {})
}

describe('useVirtualList hook', () => {
  it('renders without failure when no ref is specified', () => {
    expect(
      getHook({
        totalItems: 0,
        itemHeight: 10,
        showOffscreenBottom: 0,
        showOffscreenTop: 0,
      }),
    ).toBeDefined()
  })

  it('gives correct starting and ending indexes when scrolled', async () => {
    const { result, waitForNextUpdate } = getHook({
      totalItems: 50,
      itemHeight: 10,
      showOffscreenBottom: 0,
      showOffscreenTop: 0,
    })
    render(
      <div data-testid="list-container" {...result.current.containerProps()}>
        <div {...result.current.wrapperProps()}>
          <p>item</p>
        </div>
      </div>,
    )
    expect(result.current.state).toStrictEqual({
      shownFrom: 1,
      shownTo: 1,
    })
    const container = screen.getByTestId('list-container')
    Object.defineProperty(container, 'clientHeight', {
      value: 101,
    })
    container.scrollTop = 300
    fireEvent.scroll(container, { target: { scrollY: 300 } })
    expect(result.current.state).toStrictEqual({
      shownFrom: 31,
      shownTo: 41,
    })
  })
})
