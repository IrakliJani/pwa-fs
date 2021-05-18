import React from 'react'
import ReactDOM from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'

import * as serviceWorkerRegistration from './workers/serviceWorkerRegistration'
import State from './stores/State'
import App from './components/App'

const state = new State()

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <App state={state} />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()
