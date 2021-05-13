import React from 'react'
import {
  Flex,
  Spacer,
  Container,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  List,
  ListItem,
  ListIcon,
  Divider,
} from '@chakra-ui/react'
import { FiFolder, FiFile, FiCornerLeftUp } from 'react-icons/fi'

const getDirectoryContent = async (directoryHandle: FileSystemDirectoryHandle) => {
  const entries: Array<FileSystemHandle> = []

  for await (let [, handler] of directoryHandle.entries()) {
    entries.push(handler)
  }

  return entries
}

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

  const cd = async (directoryHandle: FileSystemDirectoryHandle) => {
    const entries = await getDirectoryContent(directoryHandle)

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

  const handleDownloadFile = () => {}

  const currentNavigationStackIndex = navigationStack.findIndex((d) => d === currentDirectoryHandle)
  const parentDirectoryHandle = navigationStack[currentNavigationStackIndex - 1]

  return (
    <Container paddingY="5" backgroundColor="yellow.50">
      <Flex alignItems="center">
        {rootDirectoryHandle && (
          <Breadcrumb>
            {navigationStack.map((directory, index) => (
              <BreadcrumbItem key={index + '-' + directory.name}>
                <BreadcrumbLink onClick={() => handleParentDirectoryNavigation(directory)}>
                  {directory.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        )}

        <Spacer />

        <Button colorScheme="blue" onClick={handleOpenFolderDialog}>
          Open Folder
        </Button>
      </Flex>

      {currentDirectoryHandle && (
        <List marginY={2} spacing={1}>
          <Divider />

          {rootDirectoryHandle !== currentDirectoryHandle && (
            <>
              <ListItem
                {...listStyleProps}
                onClick={() => handleParentDirectoryNavigation(parentDirectoryHandle)}
              >
                <ListIcon as={FiCornerLeftUp} color="red.500" />
                ..
              </ListItem>

              <Divider />
            </>
          )}

          {currentDirectoryEntries.map((entry) => (
            <React.Fragment key={entry.kind + '-' + entry.name}>
              <ListItem
                {...listStyleProps}
                onClick={
                  entry.kind === 'directory'
                    ? () => handleChangeDirectory(entry)
                    : handleDownloadFile
                }
              >
                <ListIcon as={entry.kind === 'directory' ? FiFolder : FiFile} color="red.500" />

                {entry.name}
              </ListItem>

              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  )
}

const listStyleProps = {
  borderRadius: 'md',
  paddingX: 3,
  paddingY: 2,
  cursor: 'pointer',
  _hover: {
    background: 'white',
    color: 'red.500',
  },
}

export default App
