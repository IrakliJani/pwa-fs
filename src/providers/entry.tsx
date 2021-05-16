import React from 'react'

type EntryContextType = {
  isExpanded: boolean
}

const EntryContext = React.createContext<EntryContextType>({
  isExpanded: false,
})

type EntryContextProviderProps = {
  isExpanded?: boolean
  children: React.ReactNode
}

const EntryContextProvider: React.FunctionComponent<EntryContextProviderProps> = ({
  isExpanded,
  children,
}) => {
  return isExpanded !== undefined ? (
    <EntryContext.Provider value={{ isExpanded }}>{children}</EntryContext.Provider>
  ) : (
    <>{children}</>
  )
}

const useEntry = () => {
  const entry = React.useContext(EntryContext)

  if (!entry) throw new Error('EntryContextProvider is missing')

  return entry
}

export { EntryContextProvider, useEntry }
