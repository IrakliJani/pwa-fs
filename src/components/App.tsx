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

import State from '../stores/State'
import Navigation from './Navigation'
import GoTo from './GoTo'
import EntryList from './EntryList'
import { listStyleProps } from './EntryItem'
import Dir from '../stores/Dir'
import File from '../stores/File'

type AppProps = {
  state: State
}

const App: React.FC<AppProps> = observer(({ state }) => {
  const handleOpenFolderDialog = async () => {
    const rootHandle = await window.showDirectoryPicker()
    state.setRootDir(rootHandle)
  }

  const handleChangeDir = (dir: Dir) => {
    state.changeDir(dir)
  }

  const handleGoTo = (path: string) => {
    state.goToPath(path)
  }

  const handleDownloadFile = (file: File) => {
    file.download()
  }

  return (
    <Container maxW="100%" height="100vh" backgroundColor="yellow.50" overflow="hidden">
      {!state.current ? (
        <Flex height="inherit" alignItems="center" justifyContent="center" flexDirection="column">
          <Text textAlign="center">Click "Open Folder" button below to get started...</Text>

          <Button colorScheme="red" onClick={handleOpenFolderDialog} marginTop={3}>
            Open Folder
          </Button>
        </Flex>
      ) : (
        <Flex flexDirection="column" paddingY="5" height="inherit">
          <Flex alignItems="center">
            <Navigation entries={state.stack} onNavigate={handleChangeDir} />

            <Spacer />

            <GoTo onSubmit={handleGoTo}>
              <Button variant="outline" colorScheme="red" marginLeft={2} size="sm">
                Go To...
              </Button>
            </GoTo>
          </Flex>

          <Box overflowY="scroll" flex="1" marginY={5}>
            <EntryList
              dir={state.current}
              onDirChange={handleChangeDir}
              onClickFile={handleDownloadFile}
            >
              {state.root !== state.current && (
                <>
                  <Divider />

                  <ListItem
                    {...listStyleProps}
                    cursor="pointer"
                    onClick={() => handleChangeDir(state.current!.parent!)}
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
