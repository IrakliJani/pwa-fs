import React from 'react'
import { observer } from 'mobx-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Icon } from '@chakra-ui/react'
import { FiChevronsRight } from 'react-icons/fi'

import Dir from '../stores/Dir'

type StackNavigationProps = {
  stack: Dir[]
  currentDir: Dir
  onNavigate: (dir: Dir) => void
}

const StackNavigation: React.FC<StackNavigationProps> = observer(
  ({ stack, currentDir, onNavigate }) => {
    return (
      <Flex alignItems="center">
        <Icon as={FiChevronsRight} width={4} height={4} marginX={2} />

        <Breadcrumb color="gray.400">
          {stack.map((dir, index) => (
            <BreadcrumbItem key={index + '-' + dir.handle.name}>
              <BreadcrumbLink
                fontWeight={dir === currentDir ? 'bold' : 'normal'}
                textColor={dir === currentDir ? 'red.500' : 'initial'}
                onClick={() => onNavigate(dir)}
              >
                {dir.handle.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </Flex>
    )
  },
)

export default StackNavigation
