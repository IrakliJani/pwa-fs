import React from 'react'
import { ListItem, ListIcon, Box, Link, Spacer, Button } from '@chakra-ui/react'
import { FiFolder, FiFile, FiChevronRight, FiChevronDown } from 'react-icons/fi'

import { EntryContextProvider, useEntry } from './../providers/entry'
import EntryList from './EntryList'
import { observer } from 'mobx-react'

import Dir from '../stores/Dir'
import File from '../stores/File'
import { Entry } from '../stores/State'

type EntryItemProps = {
  entry: Entry
  onDirChange: (dir: Dir) => void
  onClickFile: (file: File) => void
}

const EntryItem: React.FC<EntryItemProps> = observer(({ entry, onDirChange, onClickFile }) => {
  // const parentEntryState = useEntry()
  // const [isOpen, setOpen] = React.useState<boolean>(parentEntryState.isExpanded)
  // const [isExpanded, setExpanded] = React.useState<boolean>()
  const [showButton, setShowbutton] = React.useState<boolean>(false)

  const handleOpen = (dir: Dir) => {
    if (dir.isOpen) {
      dir.close()
      dir.collapse()
    } else {
      dir.open()
      dir.collapse()
    }
  }

  const handleExpand = (dir: Dir) => {
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
        {entry instanceof Dir ? (
          <ListIcon
            as={entry.isOpen ? FiChevronDown : FiChevronRight}
            color="gray.500"
            cursor="pointer"
            _hover={{
              backgroundColor: 'gray.100',
            }}
            onClick={() => handleOpen(entry)}
          />
        ) : (
          <Box boxSize={3.5} marginInlineEnd={2} />
        )}

        <ListIcon as={entry instanceof Dir ? FiFolder : FiFile} color="red.500" />

        <Link onClick={entry instanceof Dir ? () => onDirChange(entry) : () => onClickFile(entry)}>
          {entry.handle.name}
        </Link>

        <Spacer />

        {entry instanceof Dir && showButton && !entry.isExpanded && !entry.isOpen && (
          <Button size="xs" onClick={() => handleExpand(entry)}>
            Expand
          </Button>
        )}
      </ListItem>

      {entry instanceof Dir && entry.isOpen && (
        <EntryList marginLeft={6} dir={entry} onDirChange={onDirChange} onClickFile={onClickFile} />
      )}
    </EntryContextProvider>
  )
})

export const listStyleProps = {
  display: 'flex',
  alignItems: 'center',
  borderRadius: 'md',
  paddingX: 2,
  paddingY: 1,
  _hover: {
    background: 'white',
    color: 'red.500',
  },
}

export default EntryItem
