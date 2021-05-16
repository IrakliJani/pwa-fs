import React from 'react'
import { observer } from 'mobx-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text } from '@chakra-ui/react'

type NavigationProps = {
  entries: FileSystemDirectoryHandle[]
  onNavigate: (dirHandle: FileSystemDirectoryHandle) => void
}

const Navigation: React.FC<NavigationProps> = observer(({ entries, onNavigate }) => {
  return (
    <>
      <Text marginRight={2}>pwd:</Text>

      <Breadcrumb>
        {entries.map((directory, index) => (
          <BreadcrumbItem key={index + '-' + directory.name}>
            <BreadcrumbLink onClick={() => onNavigate(directory)}>{directory.name}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </>
  )
})

export default Navigation
