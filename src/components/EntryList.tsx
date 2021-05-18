import React from 'react'
import { List, Divider, ListProps, ListItem, Flex, Spinner } from '@chakra-ui/react'
import { observer } from 'mobx-react'

import EntryItem from './EntryItem'
import Dir from '../stores/Dir'
import File from '../stores/File'
import { Entry } from '../stores/State'

interface EntryListProps {
  children?: React.ReactNode
  dir: Dir
  onDirChange: (dir: Dir) => void
  onClickFile: (file: File) => void
}

const EntryList: React.FC<Omit<ListProps, 'dir'> & EntryListProps> = observer(
  ({ children, dir, onDirChange, onClickFile, ...listProps }) => {
    return (
      <List {...listProps}>
        {children}

        {dir.entries === null ? (
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
        ) : dir.entries && dir.entries.length > 0 ? (
          <>
            {dir.entries
              .slice()
              .sort(sortEntries)
              .map((entry) => (
                <React.Fragment key={entry.handle.kind + '-' + entry.handle.name}>
                  <ListItem>
                    <Divider />
                  </ListItem>

                  <EntryItem entry={entry} onDirChange={onDirChange} onClickFile={onClickFile} />
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
  },
)

const sortEntries = (aEntry: Entry, bEntry: Entry): number => {
  const localeResult = aEntry.handle.name.localeCompare(
    bEntry.handle.name,
    navigator.languages[0] || navigator.language,
    {
      numeric: true,
    },
  )

  if (aEntry.handle.kind === bEntry.handle.kind) {
    return 0 + localeResult
  } else if (aEntry.handle.kind === 'directory' && bEntry.handle.kind === 'file') {
    return -10 + localeResult
  } else {
    return 10 + localeResult
  }
}

export default EntryList
