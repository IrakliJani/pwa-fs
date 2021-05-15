import React from 'react'

type EntryContextType = {
  isExpanded: boolean
}

const EntryContext = React.createContext<EntryContextType>({
  isExpanded: false,
})

type EntryContextProviderProps = {
  value: EntryContextType
  children: React.ReactNode
}

const EntryContextProvider: React.FunctionComponent<EntryContextProviderProps> = ({
  value,
  children,
}) => {
  return <EntryContext.Provider value={value}>{children}</EntryContext.Provider>
}

const useEntry = () => {
  const entry = React.useContext(EntryContext)

  if (!entry) throw new Error('EntryContextProvider is missing')

  return entry
}

export { EntryContextProvider, useEntry }
