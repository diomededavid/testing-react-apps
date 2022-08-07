// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {renderHook, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'

function setup({initialProps} = {}) {
  const result = renderHook(useCounter)
  function TestComponent() {
    result.current = useCounter(initialProps)
    return null
  }
  render(<TestComponent />)
  return result
}

test('exposes the count and increment/decrement functions', () => {
  // 🐨 render the component
  const result = renderHook(useCounter)
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
  console.log(result)
})

test('allows customization of the initial count', () => {
  const {result} = renderHook(useCounter, {
    initialProps: {
      initialCount: 3,
    },
  })

  expect(result.current.count).toBe(3)
  act(() => result.current.increment())
  expect(result.current.count).toBe(4)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(3)
  console.log(result)
})

test('allows customization of the step', () => {
  const {result} = setup(useCounter, {
    initialProps: {
      step: 2,
    },
  })

  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(2)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
  console.log(result)
})

test('the step can be changed', () => {
  const {result, rerender} = setup(useCounter, {
    initialProps: {
      step: 3,
    },
  })

  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(3)
  rerender({step: 2})
  act(() => result.current.decrement())
  expect(result.current.count).toBe(1)
  console.log(result)
})

/* eslint no-unused-vars:0 */
