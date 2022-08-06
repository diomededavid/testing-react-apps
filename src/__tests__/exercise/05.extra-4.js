// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
import {
  getByLabelText,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {handlers} from '../../test/server-handlers'
import Login from '../../components/login-submission'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})
// Shared server handlers from import instead of declaring server.
const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

// you'll want to respond with an JSON object that has the username.
// 📜 https://mswjs.io/

// 🐨 before all the tests, start the server with `server.listen()`
// 🐨 after all the tests, stop the server with `server.close()`

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.type(screen.getByLabelText(/password/i), password)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByText(username)).toBeInTheDocument()
  // as soon as the user hits submit, we render a spinner to the screen. That
  // spinner has an aria-label of "loading" for accessibility purposes, so
  // 🐨 wait for the loading spinner to be removed using waitForElementToBeRemoved
  // 📜 https://testing-library.com/docs/dom-testing-library/api-async#waitforelementtoberemoved

  // once the login is successful, then the loading spinner disappears and
  // we render the username.
  // 🐨 assert that the username is on the screen
})

test('omitting the password results in an error ', async () => {
  render(<Login />)
  const {username} = buildLoginForm()
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await userEvent.type(screen.getByLabelText(/username/i), username)
  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})

test('unknown server error displays the error message', async () => {
  const testErrorMessage = 'Oh no, something bad happened'
  server.use(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({message: 'Oh no, something bad happened'}),
        )
      },
    ),
  )
  render(<Login />)
  const {username} = buildLoginForm()
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await userEvent.type(screen.getByLabelText(/username/i), username)
  expect(screen.getByRole('alert')).toHaveTextContent(testErrorMessage)
})
