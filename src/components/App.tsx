import React from 'react'
import { observer } from 'mobx-react'
import { Flex, Box, Spacer, Container, Button, Divider, Text } from '@chakra-ui/react'

import Dir from '../stores/Dir'
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

  const handleStackNavigation = (dir: Dir) => {
    store.changeDir(dir)
  }

  const handleGoTo = (path: string) => {
    store.goToPath(path)
  }

  return (
    <Container maxW="100%" height="100vh" backgroundColor="yellow.50" overflow="hidden">
      {!store.currentDir ? (
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
              stack={store.stack}
              currentDir={store.currentDir}
              onNavigate={handleStackNavigation}
            />

            <Spacer />

            <GoTo onSubmit={handleGoTo}>
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
