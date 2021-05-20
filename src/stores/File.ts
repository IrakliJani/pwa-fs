import { makeAutoObservable } from 'mobx'

import Dir from './Dir'
import { downloadFile } from './_utils'

class File {
  handle: FileSystemFileHandle
  parent?: Dir

  constructor(handle: FileSystemFileHandle, dir?: Dir) {
    makeAutoObservable(this)

    this.handle = handle
    this.parent = dir
  }

  *download() {
    yield downloadFile(this.handle)
  }
}

export default File
