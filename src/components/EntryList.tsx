import React from 'react'
import { observer } from 'mobx-react'
import { List, ListItem, ListIcon, ListProps, Divider, Flex, Spinner } from '@chakra-ui/react'
import { FiCornerLeftUp } from 'react-icons/fi'

import { useStore } from '../providers/StoreProvider'
import Dir from '../stores/Dir'
import File from '../stores/File'
import { Entry } from '../stores/Store'
import EntryFile from './EntryFile'
import EntryDir from './EntryDir'
import { listStyleProps } from './_styles'

interface EntryListProps {
  isRoot?: boolean
  dir: Dir
}

const EntryList: React.FC<Omit<ListProps, 'dir'> & EntryListProps> = observer(
  ({ isRoot, dir, ...listProps }) => {
    const store = useStore()

    const handleNavigateUp = () => {
      if (!dir.parent) throw new Error('Parent dir does not exist...')

      store.changeDir(dir.parent)
    }

    return (
      <List {...listProps}>
        {!isRoot && !dir.isOpen && dir.parent && (
          <>
            <Divider />

            <ListItem {...listStyleProps} cursor="pointer" onClick={handleNavigateUp}>
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
                    <EntryDir dir={entry} />
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
