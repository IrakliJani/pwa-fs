import React from 'react'
import ReactDOM from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'

import * as serviceWorkerRegistration from './workers/serviceWorkerRegistration'
import Store from './stores/Store'
import App from './components/App'

const store = new Store()

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <App store={store} />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()
