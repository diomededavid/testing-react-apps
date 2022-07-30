// simple test with ReactDOM
// http://localhost:3000/counter

import * as React from 'react'
import {render} from 'react-dom'
import {createRoot} from 'react-dom/client'
import {act} from 'react-dom/test-utils'

import Counter from '../../components/counter'
import * as assert from 'assert'

// NOTE: this is a new requirement in React 18
// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
// Luckily, it's handled for you by React Testing Library :)
global.IS_REACT_ACT_ENVIRONMENT = true

// Empty beforeEach Clear tests between each other to prevent false positives in texts
beforeEach(() => {
  document.body.innerHTML = ''
})

test('counter increments and decrements when the buttons are clicked', () => {
  const div = document.createElement('div')
  document.body.append(div)

  const root = createRoot(div)
  act(() => root.render(<Counter />))
  const [decrement, increment] = div.querySelectorAll('button')

  const message = div.firstChild.querySelector('div')
  expect(message.textContent).toBe('Current count: 0')

  // Using Dispatch event
  const incrementClickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0,
  })
  act(() => increment.dispatchEvent(incrementClickEvent))
  expect(message.textContent).toBe('Current count: 1')

  act(() => decrement.dispatchEvent(incrementClickEvent))
  expect(message.textContent).toBe('Current count: 0')
})

/* eslint no-unused-vars:0 */
