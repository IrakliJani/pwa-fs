import React from 'react'
import { observer } from 'mobx-react'
import { Flex, Box, Spacer, Container, Button, Divider, Text, Link, Icon } from '@chakra-ui/react'
import { FiExternalLink } from 'react-icons/fi'

import StackNavigation from './StackNavigation'
import GoTo from './GoTo'
import EntryList from './EntryList'
import { useStore } from '../providers/StoreProvider'

const App: React.FC = observer(() => {
  const store = useStore()

  const handleOpenFolderDialog = async () => {
    const rootHandle = await window.showDirectoryPicker()
    store.setRootDir(rootHandle)
  }

  return (
    <Container maxW="100%" height="100vh" backgroundColor="yellow.50" overflow="hidden">
      {!('showDirectoryPicker' in window) ? (
        <Flex height="inherit" alignItems="center" justifyContent="center">
          <Text>
            This browser does not{' '}
            <Link href="https://caniuse.com/native-filesystem-api" isExternal>
              support <Icon as={FiExternalLink} width={3} height={3} mb={2} mr={2} />
            </Link>{' '}
            <Link
              href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API"
              fontWeight="bold"
              isExternal
            >
              File System Access API <Icon as={FiExternalLink} width={3} height={3} mb={2} mr={2} />
            </Link>
          </Text>
        </Flex>
      ) : store.currentDir === undefined ? (
        <Flex height="inherit" alignItems="center" justifyContent="center" flexDirection="column">
          <Text textAlign="center">Click "Open Folder" button below to get started...</Text>

          <Button colorScheme="red" onClick={handleOpenFolderDialog} marginTop={3}>
            Open Folder
          </Button>
        </Flex>
      ) : (
        <Flex flexDirection="column" paddingY="5" height="inherit">
          <Flex alignItems="center">
            <StackNavigation
              currentDirStack={store.currentDirStack}
              currentDir={store.currentDir}
              onNavigate={(dir) => store.changeDir(dir)}
            />

            <Spacer />

            <GoTo onSubmit={(path) => store.goToPath(path)}>
              <Button variant="outline" colorScheme="red" marginLeft={2} size="sm">
                Go To...
              </Button>
            </GoTo>
          </Flex>

          <Box overflowY="scroll" flex="1" marginY={5}>
            <EntryList isRoot={store.rootDir === store.currentDir} dir={store.currentDir} />

            <Divider />
          </Box>
        </Flex>
      )}
    </Container>
  )
})

export default App
