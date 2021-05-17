import React from 'react'
import { List, Divider, ListProps, ListItem } from '@chakra-ui/react'

import EntryItem from './EntryItem'

interface EntryListProps extends ListProps {
  children?: React.ReactNode
  entries: FileSystemHandle[]
  onDirectoryChange: (dir: FileSystemDirectoryHandle) => void
  onFileClick: (file: FileSystemFileHandle) => void
}

const EntryList: React.FC<EntryListProps> = ({
  children,
  entries,
  onDirectoryChange,
  onFileClick,
  ...listProps
}) => {
  return (
    <List {...listProps}>
      {children}

      {entries.length > 0 ? (
        <>
          {entries.sort(sortEntries).map((entry) => (
            <React.Fragment key={entry.kind + '-' + entry.name}>
              <ListItem>
                <Divider />
              </ListItem>

              <EntryItem
                entry={entry}
                onDirectoryChange={onDirectoryChange}
                onFileClick={onFileClick}
              />
            </React.Fragment>
          ))}
        </>
      ) : (
        <>
          <ListItem>
            <Divider />
          </ListItem>

          <ListItem textAlign="center" fontSize="sm" paddingY="1">
            Directory is empty...
          </ListItem>
        </>
      )}
    </List>
  )
}

const sortEntries = (aEntry: FileSystemHandle, bEntry: FileSystemHandle): number => {
  const localeResult = aEntry.name.localeCompare(
    bEntry.name,
    navigator.languages[0] || navigator.language,
    {
      numeric: true,
    },
  )

  if (aEntry.kind === bEntry.kind) {
    return 0 + localeResult
  } else if (aEntry.kind === 'directory' && bEntry.kind === 'file') {
    return -10 + localeResult
  } else {
    return 10 + localeResult
  }
}

export default EntryList
