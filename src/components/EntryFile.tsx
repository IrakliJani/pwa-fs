import React from 'react'
import { observer } from 'mobx-react'
import { ListItem, ListIcon, Box, Link } from '@chakra-ui/react'
import { FiFile } from 'react-icons/fi'

import File from '../stores/File'
import { listStyleProps } from './_styles'

type EntryFileProps = {
  file: File
}

const EntryFile: React.FC<EntryFileProps> = observer(({ file }) => {
  return (
    <ListItem {...listStyleProps}>
      <Box boxSize={3.5} marginInlineEnd={2} />

      <ListIcon as={FiFile} color="red.500" />

      <Link onClick={file.download}>{file.handle.name}</Link>
    </ListItem>
  )
})

export default EntryFile
