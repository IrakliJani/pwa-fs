import React from 'react'
import { observer } from 'mobx-react'
import { List, ListItem, ListIcon, ListProps, Divider, Flex, Spinner } from '@chakra-ui/react'
import { FiCornerLeftUp } from 'react-icons/fi'

import Dir from '../stores/Dir'
import File from '../stores/File'
import { Entry } from '../stores/State'
import EntryFile from './EntryFile'
import EntryDir from './EntryDir'
import { listStyleProps } from './_styles'

interface EntryListProps {
  isRoot?: boolean
  dir: Dir
  onDirChange: (dir: Dir) => void
}

const EntryList: React.FC<Omit<ListProps, 'dir'> & EntryListProps> = observer(
  ({ isRoot, dir, onDirChange, ...listProps }) => {
    return (
      <List {...listProps}>
        {!isRoot && !dir.isOpen && (
          <>
            <Divider />

            <ListItem {...listStyleProps} cursor="pointer" onClick={() => onDirChange(dir.parent!)}>
              <ListIcon as={FiCornerLeftUp} color="red.500" />
              ..
            </ListItem>
          </>
        )}

        {!dir.entries ? (
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
        ) : dir.entries.length > 0 ? (
          <>
            {dir.entries
              .slice()
              .sort(sortEntries)
              .map((entry) => (
                <React.Fragment key={entry.handle.kind + '-' + entry.handle.name}>
                  <ListItem>
                    <Divider />
                  </ListItem>

                  {entry instanceof Dir ? (
                    <EntryDir dir={entry} onDirChange={onDirChange} />
                  ) : entry instanceof File ? (
                    <EntryFile file={entry} />
                  ) : null}
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
