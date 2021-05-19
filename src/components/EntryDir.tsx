import React from 'react'
import { ListItem, ListIcon, Link, Spacer, Button } from '@chakra-ui/react'
import { FiFolder, FiChevronRight, FiChevronDown } from 'react-icons/fi'

import { ExpandedContextProvider, useExpanded } from '../providers/ExpandedProvider'
import EntryList from './EntryList'
import { observer } from 'mobx-react'

import Dir from '../stores/Dir'
import { listStyleProps } from './_styles'

type EntryDirProps = {
  dir: Dir
  onDirChange: (dir: Dir) => void
}

const EntryDir: React.FC<EntryDirProps> = observer(({ dir, onDirChange }) => {
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
          color="gray.500"
          cursor="pointer"
          _hover={{
            backgroundColor: 'gray.100',
          }}
          onClick={handleOpen}
        />

        <ListIcon as={FiFolder} color="red.500" />

        <Link onClick={() => onDirChange(dir)}>{dir.handle.name}</Link>

        <Spacer />

        {showButton && !dir.isExpanded && !dir.isOpen && (
          <Button size="xs" onClick={handleExpand}>
            Expand
          </Button>
        )}
      </ListItem>

      {dir instanceof Dir && dir.isOpen && (
        <EntryList marginLeft={6} dir={dir} onDirChange={onDirChange} />
      )}
    </ExpandedContextProvider>
  )
})

export default EntryDir
