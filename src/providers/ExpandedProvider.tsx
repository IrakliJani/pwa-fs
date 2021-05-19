import React from 'react'

const ExpandedContext = React.createContext<boolean>(false)

type ExpandedContextProviderProps = {
  isExpanded: boolean
  children: React.ReactNode
}

const ExpandedContextProvider: React.FC<ExpandedContextProviderProps> = ({
  isExpanded,
  children,
}) => {
  return <ExpandedContext.Provider value={isExpanded}>{children}</ExpandedContext.Provider>
}

const useExpanded = () => {
  return React.useContext(ExpandedContext)
}

export { ExpandedContextProvider, useExpanded }
