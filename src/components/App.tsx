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
  Link,
  Box,
} from '@chakra-ui/react'
import { FiFolder, FiFile, FiCornerLeftUp, FiChevronRight, FiChevronDown } from 'react-icons/fi'

import { EntryContextProvider, useEntry } from './../providers/entry'
import { getDirectoryEntries } from './../utils'
import GoTo from './GoTo'

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

    const link = document.createElement('a')
    const url = window.URL.createObjectURL(file)
    link.href = url
    link.setAttribute('download', fileHandle.name)
    link.click()
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

        {rootDirectoryHandle && (
          <GoTo onSubmit={handleGoTo}>
            <Button variant="outline" colorScheme="blue" marginLeft={2}>
              Go To...
            </Button>
          </GoTo>
        )}
      </Flex>

      {currentDirectoryHandle && (
        <List>
          <Divider />

          {rootDirectoryHandle !== currentDirectoryHandle && (
            <>
              <ListItem
                {...listStyleProps}
                cursor="pointer"
                onClick={() => handleParentDirectoryNavigation(parentDirectoryHandle)}
              >
                <ListIcon as={FiCornerLeftUp} color="red.500" />
                ..
              </ListItem>

              <Divider />
            </>
          )}

          {currentDirectoryEntries
            .sort((aEntry, bEntry) => {
              const localeResult = aEntry.name.localeCompare(
                bEntry.name,
                navigator.languages[0] || navigator.language,
                {
                  numeric: true,
                },
              )

              if (aEntry.kind === bEntry.kind) {
                return 0 + localeResult
              } else if (aEntry.kind === 'directory' && bEntry.kind === 'file') {
                return -10 + localeResult
              } else {
                return 10 + localeResult
              }
            })
            .map((entry) => (
              <React.Fragment key={entry.kind + '-' + entry.name}>
                <EntryItem
                  entry={entry}
                  name={entry.name}
                  kind={entry.kind}
                  entries={entry.kind === 'directory' ? getDirectoryEntries(entry) : null}
                  onDirectoryChange={handleChangeDirectory}
                  onFileClick={handleDownloadFile}
                />

                <Divider />
              </React.Fragment>
            ))}
        </List>
      )}
    </Container>
  )
}

type EntryItemProps = {
  entry: FileSystemHandle
  name: string
  kind: string
  entries: Promise<FileSystemHandle[]> | null
  onDirectoryChange: (dir: FileSystemDirectoryHandle) => void
  onFileClick: (file: FileSystemFileHandle) => void
}

const EntryItem: React.FunctionComponent<EntryItemProps> = ({
  entry,
  name,
  kind,
  entries,
  onDirectoryChange,
  onFileClick,
}) => {
  const parentEntryState = useEntry()
  const [isOpen, setOpen] = React.useState<boolean>(parentEntryState.isExpanded)
  const [isExpanded, setExpanded] = React.useState<boolean>(false)
  const [subItems, setSubItems] = React.useState<FileSystemHandle[]>([])
  const [showButton, setShowbutton] = React.useState<boolean>(false)

  const handleOpen = () => {
    setOpen(!isOpen)
  }

  const handleExpand = () => {
    setOpen(true)
    setExpanded(true)
  }

  React.useEffect(() => {
    if (!entries) return

    if (isOpen) {
      ;(async function getEntries() {
        setSubItems(await entries!)
      })()
    } else {
      setSubItems([])
    }
  }, [isOpen, setSubItems, entries])

  return (
    <EntryContextProvider value={{ isExpanded: isExpanded || parentEntryState.isExpanded }}>
      <ListItem
        {...listStyleProps}
        onMouseEnter={() => setShowbutton(true)}
        onMouseLeave={() => setShowbutton(false)}
      >
        {kind === 'directory' ? (
          <ListIcon
            as={isOpen ? FiChevronDown : FiChevronRight}
            color="gray.500"
            cursor="pointer"
            _hover={{
              backgroundColor: 'gray.100',
            }}
            onClick={handleOpen}
          />
        ) : (
          <Box boxSize={3.5} marginInlineEnd={2} />
        )}

        <ListIcon as={kind === 'directory' ? FiFolder : FiFile} color="red.500" />

        <Link
          onClick={
            kind === 'directory'
              ? () => onDirectoryChange(entry as FileSystemDirectoryHandle)
              : () => onFileClick(entry as FileSystemFileHandle)
          }
        >
          {name}
        </Link>

        <Spacer />

        {kind === 'directory' && showButton && !isOpen && (
          <Button size="xs" onClick={handleExpand}>
            Expand
          </Button>
        )}
      </ListItem>

      {subItems.length > 0 && (
        <List marginLeft={6}>
          {subItems
            .sort((aEntry, bEntry) => {
              const localeResult = aEntry.name.localeCompare(
                bEntry.name,
                navigator.languages[0] || navigator.language,
                {
                  numeric: true,
                },
              )

              if (aEntry.kind === bEntry.kind) {
                return 0 + localeResult
              } else if (aEntry.kind === 'directory' && bEntry.kind === 'file') {
                return -10 + localeResult
              } else {
                return 10 + localeResult
              }
            })
            .map((subItem) => (
              <React.Fragment key={subItem.kind + '-' + subItem.name}>
                <Divider />

                <EntryItem
                  entry={subItem}
                  name={subItem.name}
                  kind={subItem.kind}
                  entries={subItem.kind === 'directory' ? getDirectoryEntries(subItem) : null}
                  onDirectoryChange={onDirectoryChange}
                  onFileClick={onFileClick}
                />
              </React.Fragment>
            ))}
        </List>
      )}
    </EntryContextProvider>
  )
}

const listStyleProps = {
  display: 'flex',
  alignItems: 'center',
  borderRadius: 'md',
  paddingX: 2,
  paddingY: 1,
  _hover: {
    background: 'white',
    color: 'red.500',
  },
}

export default App
