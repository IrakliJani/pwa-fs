import React from 'react'
import { List, Divider, ListProps } from '@chakra-ui/react'

import { getDirectoryEntries } from './../utils'
import EntryItem from './EntryItem'

interface EntryListProps extends ListProps {
  children?: React.ReactNode
  entries: FileSystemHandle[]
  onDirectoryChange: (dir: FileSystemDirectoryHandle) => void
  onFileClick: (file: FileSystemFileHandle) => void
}

const EntryList: React.FunctionComponent<EntryListProps> = ({
  children,
  entries,
  onDirectoryChange,
  onFileClick,
  ...listProps
}) => {
  return (
    <List {...listProps}>
      {children}

      {entries.sort(sortEntries).map((entry) => (
        <React.Fragment key={entry.kind + '-' + entry.name}>
          <Divider />

          <EntryItem
            entry={entry}
            name={entry.name}
            kind={entry.kind}
            entries={entry.kind === 'directory' ? getDirectoryEntries(entry) : null}
            onDirectoryChange={onDirectoryChange}
            onFileClick={onFileClick}
          />
        </React.Fragment>
      ))}
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
