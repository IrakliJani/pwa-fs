import React from 'react'
import { observer } from 'mobx-react'
import { ListItem, ListIcon, Link, Spacer, Button } from '@chakra-ui/react'
import { FiFolder, FiChevronRight, FiChevronDown } from 'react-icons/fi'

import { ExpandedContextProvider, useExpanded } from '../providers/ExpandedProvider'
import { useStore } from '../providers/StoreProvider'
import Dir from '../stores/Dir'
import EntryList from './EntryList'
import { listStyleProps } from './_styles'

type EntryDirProps = {
  dir: Dir
}

const EntryDir: React.FC<EntryDirProps> = observer(({ dir }) => {
  const store = useStore()
  const isExpanded = useExpanded()
  const [showButton, setShowbutton] = React.useState<boolean>(false)

  const handleOpen = () => {
    if (dir.isOpen) {
      dir.close()
      dir.collapse()
    } else {
      dir.open()
      dir.collapse()
    }
  }

  const handleExpand = React.useCallback(() => {
    dir.open()
    dir.expand()
  }, [dir])

  const handleChangeDir = () => {
    store.changeDir(dir)
  }

  React.useEffect(() => {
    if (isExpanded) handleExpand()
  }, [handleExpand, isExpanded])

  return (
    <ExpandedContextProvider isExpanded={dir.isExpanded}>
      <ListItem
        {...listStyleProps}
        onMouseEnter={() => setShowbutton(true)}
        onMouseLeave={() => setShowbutton(false)}
      >
        <ListIcon
          as={dir.isOpen ? FiChevronDown : FiChevronRight}
          color={dir.isOpen ? 'red.500' : 'gray.400'}
          cursor="pointer"
          _hover={{
            color: 'gray.800',
            backgroundColor: 'gray.100',
            borderRadius: 2,
          }}
          userSelect="none"
          onClick={handleOpen}
        />

        <ListIcon as={FiFolder} color="red.500" fill={dir.isOpen ? 'red.300' : undefined} />

        <Link fontWeight={dir.isOpen ? 'bold' : 'initial'} onClick={handleChangeDir}>
          {dir.handle.name}
        </Link>

        <Spacer />

        {showButton && !dir.isExpanded && !dir.isOpen && (
          <Button size="xs" onClick={handleExpand}>
            Expand
          </Button>
        )}
      </ListItem>

      {dir instanceof Dir && dir.isOpen && <EntryList marginLeft={6} dir={dir} />}
    </ExpandedContextProvider>
  )
})

export default EntryDir
