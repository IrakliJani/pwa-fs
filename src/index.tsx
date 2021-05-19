import React from 'react'
import ReactDOM from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'

import Store from './stores/Store'
import App from './components/App'
import { StoreContextProvider } from './providers/StoreProvider'

import * as serviceWorkerRegistration from './serviceWorkerRegistration'

const store = new Store()

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <StoreContextProvider store={store}>
        <App />
      </StoreContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()
