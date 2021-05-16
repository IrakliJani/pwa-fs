import React from 'react'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react'
import {
  Flex,
  Box,
  Spacer,
  Container,
  Button,
  ListItem,
  ListIcon,
  Divider,
  Text,
} from '@chakra-ui/react'
import { FiCornerLeftUp } from 'react-icons/fi'

import { getDirectoryEntries, downloadFile } from './../utils'
import Dir from './../stores/dir'
import Navigation from './Navigation'
import GoTo from './GoTo'
import EntryList from './EntryList'
import { listStyleProps } from './EntryItem'

type AppProps = {
  dir: Dir
}

const App: React.FC<AppProps> = observer(({ dir }) => {
  const cd = async (dirHandle: FileSystemDirectoryHandle) => {
    const entities = await getDirectoryEntries(dirHandle)

    runInAction(() => {
      dir.entries = entities
      dir.current = dirHandle
    })
  }

  const handleOpenFolderDialog = async () => {
    const rootHandle = await window.showDirectoryPicker()

    await cd(rootHandle)

    runInAction(() => {
      dir.root = rootHandle
      dir.stack.push(rootHandle)
    })
  }

  const handleGoTo = async (pathString: string) => {
    const pathes = pathString.split('/').filter(Boolean)

    let currentHandle = dir.root!
    let stack = [currentHandle]

    for (let path of pathes) {
      const entries = await getDirectoryEntries(currentHandle)
      const entry = entries
        .filter((entry) => entry.kind === 'directory')
        .find((entry) => entry.name === path) as FileSystemDirectoryHandle | undefined

      if (!entry) throw new Error('path does not exist...')

      currentHandle = entry
      stack.push(entry)
    }

    await cd(currentHandle)

    runInAction(() => {
      dir.stack = stack
    })
  }

  const handleParentDirectoryNavigation = async (dirHandle: FileSystemDirectoryHandle) => {
    await cd(dirHandle)

    runInAction(() => {
      const index = dir.stack.findIndex((d) => d === dirHandle)
      dir.stack.splice(index + 1)
    })
  }

  const handleChangeDirectory = async (dirHandle: FileSystemDirectoryHandle) => {
    await cd(dirHandle)

    runInAction(() => {
      dir.stack.push(dirHandle)
    })
  }

  const handleDownloadFile = async (fileHandle: FileSystemFileHandle) => {
    const file: File = await fileHandle.getFile()
    downloadFile(file, fileHandle.name)
  }

  const currentDirIndex = dir.stack.findIndex((d) => d === dir.current)
  const parentDirHandle = dir.stack[currentDirIndex - 1]

  return (
    <Container maxW="100%" height="100vh" backgroundColor="yellow.50" overflow="hidden">
      {!dir.root ? (
        <Flex height="inherit" alignItems="center" justifyContent="center" flexDirection="column">
          <Text textAlign="center">Click "Open Folder" Button to get started...</Text>

          <Button colorScheme="red" onClick={handleOpenFolderDialog} marginTop={3}>
            Open Folder
          </Button>
        </Flex>
      ) : (
        <Flex flexDirection="column" paddingY="5" height="inherit">
          <Flex alignItems="center">
            <Navigation entries={dir.stack} onNavigate={handleParentDirectoryNavigation} />

            <Spacer />

            <GoTo onSubmit={handleGoTo}>
              <Button variant="outline" colorScheme="red" marginLeft={2} size="sm">
                Go To...
              </Button>
            </GoTo>
          </Flex>

          <Box overflowY="scroll" flex="1" marginY={5}>
            <EntryList
              entries={dir.entries}
              onDirectoryChange={handleChangeDirectory}
              onFileClick={handleDownloadFile}
            >
              {dir.root !== dir.current && (
                <>
                  <Divider />

                  <ListItem
                    {...listStyleProps}
                    cursor="pointer"
                    onClick={() => handleParentDirectoryNavigation(parentDirHandle)}
                  >
                    <ListIcon as={FiCornerLeftUp} color="red.500" />
                    ..
                  </ListItem>
                </>
              )}
            </EntryList>

            <Divider />
          </Box>
        </Flex>
      )}
    </Container>
  )
})

export default App
