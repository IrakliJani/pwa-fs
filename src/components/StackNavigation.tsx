import React from 'react'
import { observer } from 'mobx-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Icon } from '@chakra-ui/react'
import { FiChevronsRight } from 'react-icons/fi'

import Dir from '../stores/Dir'

type StackNavigationProps = {
  currentDirStack: Dir[]
  currentDir: Dir
  onNavigate: (dir: Dir) => void
}

const StackNavigation: React.FC<StackNavigationProps> = observer(
  ({ currentDirStack, currentDir, onNavigate }) => {
    return (
      <Flex alignItems="center">
        <Icon as={FiChevronsRight} width={4} height={4} marginX={2} />

        <Breadcrumb color="gray.400">
          {currentDirStack.map((dir, index) => (
            <BreadcrumbItem key={index + '-' + dir.handle.name}>
              <BreadcrumbLink
                fontWeight="normal"
                textColor="initial"
                onClick={() => onNavigate(dir)}
              >
                {dir.handle.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}

          <BreadcrumbItem isCurrentPage fontWeight="bold" textColor="red.500">
            <BreadcrumbLink>{currentDir.handle.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>
    )
  },
)

export default StackNavigation
