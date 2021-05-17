import React from 'react'
import {
  ListItem,
  ListIcon,
  Box,
  Link,
  Spacer,
  Button,
  Spinner,
  Flex,
  Divider,
} from '@chakra-ui/react'
import { FiFolder, FiFile, FiChevronRight, FiChevronDown } from 'react-icons/fi'

import { EntryContextProvider, useEntry } from './../providers/entry'
import EntryList from './EntryList'

type EntryItemProps = {
  entry: FileSystemHandle
  onDirectoryChange: (dir: FileSystemDirectoryHandle) => void
  onFileClick: (file: FileSystemFileHandle) => void
}

const EntryItem: React.FC<EntryItemProps> = ({ entry, onDirectoryChange, onFileClick }) => {
  const parentEntryState = useEntry()
  const [isOpen, setOpen] = React.useState<boolean>(parentEntryState.isExpanded)
  const [isExpanded, setExpanded] = React.useState<boolean>()
  const [showButton, setShowbutton] = React.useState<boolean>(false)

  const handleOpen = () => {
    if (isOpen) {
      setOpen(false)
      setExpanded(false)
    } else {
      setOpen(true)
      setExpanded(false)
    }
  }

  const handleExpand = () => {
    setOpen(true)
    setExpanded(true)
  }

  return (
    <EntryContextProvider isExpanded={isExpanded}>
      <ListItem
        {...listStyleProps}
        onMouseEnter={() => setShowbutton(true)}
        onMouseLeave={() => setShowbutton(false)}
      >
        {entry.kind === 'directory' ? (
          <ListIcon
            as={isOpen ? FiChevronDown : FiChevronRight}
            color="gray.500"
            cursor="pointer"
            _hover={{
              backgroundColor: 'gray.100',
            }}
            onClick={handleOpen}
          />
        ) : (
          <Box boxSize={3.5} marginInlineEnd={2} />
        )}

        <ListIcon as={entry.kind === 'directory' ? FiFolder : FiFile} color="red.500" />

        <Link
          onClick={
            entry.kind === 'directory'
              ? () => onDirectoryChange(entry as FileSystemDirectoryHandle)
              : () => onFileClick(entry as FileSystemFileHandle)
          }
        >
          {entry.name}
        </Link>

        <Spacer />

        {entry.kind === 'directory' && showButton && !isExpanded && !isOpen && (
          <Button size="xs" onClick={handleExpand}>
            Expand
          </Button>
        )}
      </ListItem>

      {isOpen &&
        (subEntries ? (
          <EntryList
            marginLeft={6}
            entries={subEntries}
            onDirectoryChange={onDirectoryChange}
            onFileClick={onFileClick}
          />
        ) : (
          <>
            <ListItem>
              <Divider />
            </ListItem>

            <ListItem>
              <Flex justifyContent="center">
                <Spinner size="sm" color="red.500" marginY={2} />
              </Flex>
            </ListItem>
          </>
        ))}
    </EntryContextProvider>
  )
}

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
