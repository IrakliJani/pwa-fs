import React from 'react'
import { observer } from 'mobx-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text } from '@chakra-ui/react'

import Dir from '../stores/Dir'

type NavigationProps = {
  entries: Dir[]
  onNavigate: (dir: Dir) => void
}

const Navigation: React.FC<NavigationProps> = observer(({ entries, onNavigate }) => {
  return (
    <>
      <Text marginRight={2}>pwd:</Text>

      <Breadcrumb>
        {entries.map((directory, index) => (
          <BreadcrumbItem key={index + '-' + directory.handle.name}>
            <BreadcrumbLink onClick={() => onNavigate(directory)}>
              {directory.handle.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </>
  )
})

export default Navigation
