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
  isRoot: boolean
  dir: Dir
}

const EntryList: React.FC<Omit<ListProps, 'dir'> & EntryListProps> = observer(
  ({ isRoot, dir, ...listProps }) => {
    const store = useStore()

    const handleNavigateUp = () => {
      if (dir.parent === undefined) throw new Error('Parent dir does not exist...')

      store.changeDir(dir.parent)
    }

    return (
      <List {...listProps}>
        {!isRoot && dir.parent !== undefined && !dir.isOpen && (
          <>
            <Divider />

            <ListItem {...listStyleProps} cursor="pointer" onClick={handleNavigateUp}>
              <ListIcon as={FiCornerLeftUp} color="red.500" />
              ..
            </ListItem>
          </>
        )}

        {dir.entries === undefined ? (
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

type Kind = 'directory' | 'file'
const kindOrder: Record<Kind, number> = {
  directory: 1,
  file: 2,
}

const compareKind = (a: Kind, b: Kind) => {
  return kindOrder[a] - kindOrder[b]
}

const compareName = (a: string, b: string) => {
  return a.localeCompare(b, navigator.languages[0] || navigator.language, { numeric: true })
}

const sortEntries = (aEntry: Entry, bEntry: Entry): number => {
  return (
    compareKind(aEntry.handle.kind, bEntry.handle.kind) ||
    compareName(aEntry.handle.name, bEntry.handle.name)
  )
}

export default EntryList
