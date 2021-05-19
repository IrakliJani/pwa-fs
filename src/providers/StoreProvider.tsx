import React from 'react'

import Store from '../stores/Store'

const StoreContext = React.createContext<Store | undefined>(undefined)

type StoreContextProviderProps = {
  store: Store
  children: React.ReactNode
}

const StoreContextProvider: React.FC<StoreContextProviderProps> = ({ store, children }) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

const useStore = () => {
  return React.useContext(StoreContext)!
}

export { StoreContextProvider, useStore }
