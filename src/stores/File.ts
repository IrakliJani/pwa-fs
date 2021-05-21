import { makeAutoObservable } from 'mobx'

import Dir from './Dir'
import { downloadFile } from './_utils'

class File {
  handle: FileSystemFileHandle
  parent: Dir

  constructor(handle: FileSystemFileHandle, parentDir: Dir) {
    makeAutoObservable(this)

    this.handle = handle
    this.parent = parentDir
  }

  async download() {
    downloadFile(await this.handle.getFile(), this.handle.name)
  }
}

export default File
