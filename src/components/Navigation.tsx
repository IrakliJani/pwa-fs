import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'

type NavigationProps = {
  entries: FileSystemDirectoryHandle[]
  onNavigate: (directoryHandle: FileSystemDirectoryHandle) => void
}

const Navigation: React.FunctionComponent<NavigationProps> = ({ entries, onNavigate }) => {
  return (
    <Breadcrumb>
      {entries.map((directory, index) => (
        <BreadcrumbItem key={index + '-' + directory.name}>
          <BreadcrumbLink onClick={() => onNavigate(directory)}>{directory.name}</BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  )
}

export default Navigation
