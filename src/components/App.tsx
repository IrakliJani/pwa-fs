import React from 'react'
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

import { downloadFile } from './../utils'
import Dir from './../stores/dir'
import Navigation from './Navigation'
import GoTo from './GoTo'
import EntryList from './EntryList'
import { listStyleProps } from './EntryItem'

type AppProps = {
  dir: Dir
}

const App: React.FC<AppProps> = observer(({ dir }) => {
  const handleOpenFolderDialog = async () => {
    const rootHandle = await window.showDirectoryPicker()
    dir.setRootDir(rootHandle)
  }

  const handleGoTo = async (path: string) => {
    dir.goToDir(path)
  }

  const handleNavigateToStackDir = async (dirHandle: FileSystemDirectoryHandle) => {
    dir.changeToParentDir(dirHandle)
  }

  const handleNavigateToParentDir = async () => {
    dir.changeToParentDir(dir.parentDirHandle)
  }

  const handleNavigateDirectory = async (dirHandle: FileSystemDirectoryHandle) => {
    dir.changeDir(dirHandle)
  }

  const handleDownloadFile = async (fileHandle: FileSystemFileHandle) => {
    const file: File = await fileHandle.getFile()
    downloadFile(file, fileHandle.name)
  }

  return (
    <Container maxW="100%" height="100vh" backgroundColor="yellow.50" overflow="hidden">
      {!dir.root ? (
        <Flex height="inherit" alignItems="center" justifyContent="center" flexDirection="column">
          <Text textAlign="center">Click "Open Folder" button below to get started...</Text>

          <Button colorScheme="red" onClick={handleOpenFolderDialog} marginTop={3}>
            Open Folder
          </Button>
        </Flex>
      ) : (
        <Flex flexDirection="column" paddingY="5" height="inherit">
          <Flex alignItems="center">
            <Navigation entries={dir.stack} onNavigate={handleNavigateToStackDir} />

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
              onDirectoryChange={handleNavigateDirectory}
              onFileClick={handleDownloadFile}
            >
              {dir.root !== dir.current && (
                <>
                  <Divider />

                  <ListItem
                    {...listStyleProps}
                    cursor="pointer"
                    onClick={handleNavigateToParentDir}
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
