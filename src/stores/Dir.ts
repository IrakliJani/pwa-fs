import { makeAutoObservable, runInAction } from 'mobx'

import { Entry } from './Store'
import { getDirEntries } from './_utils'

class Dir {
  handle: FileSystemDirectoryHandle
  parent?: Dir
  entries?: Entry[]

  isOpen: boolean = false
  isExpanded: boolean = false

  constructor(handle: FileSystemDirectoryHandle, parentDir?: Dir) {
    makeAutoObservable(this)

    this.handle = handle
    this.parent = parentDir
  }

  open() {
    this.isOpen = true

    this.getEntries()
  }

  close() {
    this.isOpen = false
    this.entries = undefined
  }

  expand() {
    this.isExpanded = true
  }

  collapse() {
    this.isExpanded = false
  }

  async getEntries() {
    const entries = await getDirEntries(this)

    runInAction(() => {
      this.entries = entries
    })
  }
}

export default Dir
