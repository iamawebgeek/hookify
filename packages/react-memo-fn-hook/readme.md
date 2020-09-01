# @hookify/react-memo-fn-hook
React Hook for making a memoized function

[![](https://img.shields.io/npm/v/@hookify/react-memo-fn-hook.svg)](https://www.npmjs.com/package/@hookify/react-memo-fn-hook)
[![](https://img.shields.io/npm/dt/@hookify/react-memo-fn-hook.svg)](https://www.npmjs.com/package/@hookify/react-memo-fn-hook)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Installation
Installing using node package manager.
Type the following in your console inside your project directory:
```
npm install @hookify/react-memo-fn-hook --save
```

With yarn:
```
yarn add @hookify/react-memo-fn-hook
```

## About
This library will help you to create a memoize function which will run provided function's body based on arguments only once and after the first call return the value saved from previous call. This is useful when you have a heavy function or you need to have a single reference through multiple calls with similar arguments for a React memo component.

## Usage
```typescript jsx
import * as React from 'react'
import { useMemoFn } from '@hookify/react-memo-fn-hook'

import data from './store'

const ChildComponent: React.FC = React.memo(({ options }) => {
  return (
    <ul>
      {options.map(({ title }) => (
        <li>{title}</li>
      ))}
    </ul>
  )
})

const ParentComponent: React.FC = () => {
  const [flag, setFlag] = React.useState(false)
  const createProps = useMemoFn(
    (key) => {
      if (flag) {
        return {
          options: [],
        }
      }
      return {
        options: data[key],
      }
    },
    [flag],
  )
  return (
    <>
      <Toggle onClick={() => setFlag((current) => !current)} />
      <ChildComponent {...createProps('recipes')} />
      <ChildComponent {...createProps('foods')} />
    </>
  )
}
```

## Options

### `useMemoFn(fn, dependencies, options)`
Returns memoized function
- *fn*: The function to be memoized
- *dependencies*: An array of values when those changed a new memoized function should be returned
- *options* (optional): Options to change the behaviour of the hook
  - *shallowDiffArgs*: A boolean which allows to set shallow comparison on incoming arguments, defaults to false

## License
Apache 2.0 © [iamawebgeek](https://github.com/iamawebgeek)
