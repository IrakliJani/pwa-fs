import React from 'react'
import {
  useToast,
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
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  InputGroup,
  Input,
  InputRightElement,
  Link,
  Box,
} from '@chakra-ui/react'
import { FiFolder, FiFile, FiCornerLeftUp, FiChevronRight, FiChevronDown } from 'react-icons/fi'

const getDirectoryEntries = async (directoryHandle: FileSystemDirectoryHandle) => {
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
  onDirectoryChange,
  onFileClick,
  name,
  kind,
  entries,
}) => {
  const [isExpanded, setExpanded] = React.useState<boolean>(false)
  const [subItems, setSubItems] = React.useState<FileSystemHandle[]>([])

  const handleChevronToggle = () => {
    setExpanded(!isExpanded)
  }

  React.useEffect(() => {
    if (!entries) return

    if (isExpanded) {
      ;(async function getEntries() {
        setSubItems(await entries!)
      })()
    } else {
      setSubItems([])
    }
  }, [isExpanded, setSubItems, entries])

  return (
    <Box>
      <ListItem {...listStyleProps}>
        {kind === 'directory' ? (
          <ListIcon
            as={isExpanded ? FiChevronDown : FiChevronRight}
            color="gray.500"
            cursor="pointer"
            _hover={{
              backgroundColor: 'gray.100',
            }}
            onClick={handleChevronToggle}
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
      </ListItem>

      {subItems.length > 0 && (
        <List marginLeft={6}>
          {subItems.map((subItem) => (
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
    </Box>
  )
}

type GoToProps = {
  children: React.ReactNode
  onSubmit: (pathString: string) => Promise<void>
}

const GoTo: React.FunctionComponent<GoToProps> = ({ children, onSubmit }) => {
  const initialFocusRef = React.useRef<HTMLInputElement>(null)
  const [value, setValue] = React.useState<string>('')

  const toast = useToast()

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value)
  }

  const handleSubmit = async (value: string) => {
    setValue('')

    try {
      await onSubmit(value)
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: `Error: ${e.message}`,
          status: 'error',
        })
      } else {
        console.error(e)
      }
    }
  }

  return (
    <Popover placement="bottom-end" initialFocusRef={initialFocusRef}>
      {({ onClose }) => (
        <>
          <PopoverTrigger>{children}</PopoverTrigger>

          <Portal>
            <PopoverContent>
              <PopoverArrow />

              <PopoverBody>
                <InputGroup size="md">
                  <Input
                    ref={initialFocusRef}
                    paddingRight="4.5rem"
                    placeholder="Enter folder path"
                    value={value}
                    onChange={handleChange}
                  />

                  <InputRightElement width="4.5rem">
                    <Button
                      colorScheme="blue"
                      height="1.75rem"
                      size="sm"
                      onClick={() => {
                        handleSubmit(value)
                        onClose()
                      }}
                    >
                      Go
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
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
