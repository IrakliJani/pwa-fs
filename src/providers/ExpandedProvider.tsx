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
  return isExpanded ? (
    <ExpandedContext.Provider value={isExpanded}>{children}</ExpandedContext.Provider>
  ) : (
    <>{children}</>
  )
}

const useExpanded = () => {
  return React.useContext(ExpandedContext)
}

export { ExpandedContextProvider, useExpanded }
