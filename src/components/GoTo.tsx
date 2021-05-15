import React from 'react'

import {
  useToast,
  Button,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  InputGroup,
  Input,
  InputRightElement,
} from '@chakra-ui/react'

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

export default GoTo
