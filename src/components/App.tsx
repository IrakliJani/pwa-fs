import React from 'react'
import { observer } from 'mobx-react'
import { Flex, Box, Spacer, Container, Button, Divider, Text } from '@chakra-ui/react'

import Dir from '../stores/Dir'
import Store from '../stores/Store'
import Navigation from './Navigation'
import GoTo from './GoTo'
import EntryList from './EntryList'

type AppProps = {
  store: Store
}

const App: React.FC<AppProps> = observer(({ store }) => {
  const handleOpenFolderDialog = async () => {
    const rootHandle = await window.showDirectoryPicker()
    store.setRootDir(rootHandle)
  }

  const handleChangeDir = (dir: Dir) => {
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
            <Navigation entries={store.stack} onNavigate={handleChangeDir} />

            <Spacer />

            <GoTo onSubmit={handleGoTo}>
              <Button variant="outline" colorScheme="red" marginLeft={2} size="sm">
                Go To...
              </Button>
            </GoTo>
          </Flex>

          <Box overflowY="scroll" flex="1" marginY={5}>
            <EntryList
              isRoot={store.rootDir === store.currentDir}
              dir={store.currentDir}
              onDirChange={handleChangeDir}
            />

            <Divider />
          </Box>
        </Flex>
      )}
    </Container>
  )
})

export default App
