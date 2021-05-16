import React from 'react'
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
import GoTo from './GoTo'
import EntryList from './EntryList'
import { listStyleProps } from './EntryItem'
import Navigation from './Navigation'

const App = () => {
  const [rootDirectoryHandle, setRootDirectoryHandle] = React.useState<FileSystemDirectoryHandle>()
  const [currentDirectoryHandle, setCurrentDirectoryHandle] =
    React.useState<FileSystemDirectoryHandle>()
  const [navigationStack, setNavigationStack] = React.useState<FileSystemDirectoryHandle[]>([])
  const [currentDirectoryEntries, setCurrentDirectoryEntries] = React.useState<FileSystemHandle[]>(
    [],
  )

  const handleOpenFolderDialog = async () => {
    const directoryHandle = await window.showDirectoryPicker()
    setRootDirectoryHandle(directoryHandle)

    await cd(directoryHandle)
    setNavigationStack([...navigationStack, directoryHandle])
  }

  const handleGoTo = async (pathString: string) => {
    const pathes = pathString.split('/').filter(Boolean)
    let currentHandle = rootDirectoryHandle!
    let stack = []

    for (let path of pathes) {
      const entries = await getDirectoryEntries(currentHandle)
      const entry = entries.find((entry) => entry.kind === 'directory' && entry.name === path) as
        | FileSystemDirectoryHandle
        | undefined

      if (!entry) throw new Error('path does not exist...')

      currentHandle = entry
      stack.push(entry)
    }

    await cd(currentHandle)
    setNavigationStack([...navigationStack, ...stack])
  }

  const cd = async (directoryHandle: FileSystemDirectoryHandle) => {
    const entries = await getDirectoryEntries(directoryHandle)

    setCurrentDirectoryHandle(directoryHandle)
    setCurrentDirectoryEntries(entries)
  }

  const handleParentDirectoryNavigation = async (directoryHandle: FileSystemDirectoryHandle) => {
    await cd(directoryHandle)

    const index = navigationStack.findIndex((d) => d === directoryHandle)
    setNavigationStack(navigationStack.slice(0, index + 1))
  }

  const handleChangeDirectory = async (directoryHandle: FileSystemDirectoryHandle) => {
    await cd(directoryHandle)
    setNavigationStack([...navigationStack, directoryHandle])
  }

  const handleDownloadFile = async (fileHandle: FileSystemFileHandle) => {
    const file: File = await fileHandle.getFile()
    downloadFile(file, fileHandle.name)
  }

  const currentNavigationStackIndex = navigationStack.findIndex((d) => d === currentDirectoryHandle)
  const parentDirectoryHandle = navigationStack[currentNavigationStackIndex - 1]

  return (
    <Container maxW="100%" height="100vh" backgroundColor="yellow.50" overflow="hidden">
      {!rootDirectoryHandle ? (
        <Flex height="inherit" alignItems="center" justifyContent="center" flexDirection="column">
          <Text textAlign="center">Click "Open Folder" Button to get started...</Text>

          <Button colorScheme="red" onClick={handleOpenFolderDialog} marginTop={3}>
            Open Folder
          </Button>
        </Flex>
      ) : (
        <Flex flexDirection="column" paddingY="5" height="inherit">
          <Flex alignItems="center">
            <Navigation entries={navigationStack} onNavigate={handleParentDirectoryNavigation} />

            <Spacer />

            <GoTo onSubmit={handleGoTo}>
              <Button variant="outline" colorScheme="red" marginLeft={2} size="sm">
                Go To...
              </Button>
            </GoTo>
          </Flex>

          <Box overflowY="scroll" flex="1" marginY={5}>
            <EntryList
              entries={currentDirectoryEntries}
              onDirectoryChange={handleChangeDirectory}
              onFileClick={handleDownloadFile}
            >
              {rootDirectoryHandle !== currentDirectoryHandle && (
                <>
                  <Divider />

                  <ListItem
                    {...listStyleProps}
                    cursor="pointer"
                    onClick={() => handleParentDirectoryNavigation(parentDirectoryHandle)}
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
}

export default App
