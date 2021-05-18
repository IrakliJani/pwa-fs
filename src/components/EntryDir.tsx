import React from 'react'
import { ListItem, ListIcon, Link, Spacer, Button } from '@chakra-ui/react'
import { FiFolder, FiChevronRight, FiChevronDown } from 'react-icons/fi'

import { EntryContextProvider, useEntry } from './../providers/entry'
import EntryList from './EntryList'
import { observer } from 'mobx-react'

import Dir from '../stores/Dir'
import { listStyleProps } from './_styles'

type EntryDirProps = {
  dir: Dir
  onDirChange: (dir: Dir) => void
}

const EntryDir: React.FC<EntryDirProps> = observer(({ dir, onDirChange }) => {
  // const parentEntryState = useEntry()
  // const [isOpen, setOpen] = React.useState<boolean>(parentEntryState.isExpanded)
  // const [isExpanded, setExpanded] = React.useState<boolean>()
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

  const handleExpand = () => {
    dir.open()
    dir.expand()
  }

  return (
    <EntryContextProvider isExpanded={false} /* TODO */>
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
    </EntryContextProvider>
  )
})

export default EntryDir
