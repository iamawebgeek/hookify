# @hookify/react-virtualization-hook
React Hook for making optimized lists

## Installation
Installing using node package manager.
Type the following in your console inside your project directory:
```
npm install @hookify/react-virtualization-hook --save
```

With yarn:
```
yarn add @hookify/react-virtualization-hook
```

## Usage
```typescript jsx
import * as React from 'react'
import { useVirtualList } from '@hookify/react-virtualization-hook'

const VirtualList: React.FC = () => {
  const {
    state,
    containerProps,
    wrapperProps
  } = useVirtualList({
    itemHeight: 51,
    totalItems: 40,
    showOffscreenBottom: 3,
    showOffscreenTop: 3
  })
  const items = Array.from(new Array(state.shownTo - state.shownFrom + 1).keys())
  return (
    <div className="virtual-list-container" {...containerProps()}>
      <div {...wrapperProps()}>
        {items.map((i) => (
          <p key={state.shownFrom + i}>item #{state.shownFrom + i}</p>
        ))}
      </div>
    </div>
  )
}
```
