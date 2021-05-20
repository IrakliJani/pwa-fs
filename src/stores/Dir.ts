import { makeAutoObservable } from 'mobx'

import { Entry } from './Store'
import { getDirEntries } from './_utils'

class Dir {
  handle: FileSystemDirectoryHandle
  parent?: Dir
  entries?: Entry[]

  isOpen: boolean = false
  isExpanded: boolean = false

  constructor(handle: FileSystemDirectoryHandle, dir?: Dir) {
    makeAutoObservable(this)

    this.handle = handle
    this.parent = dir
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

  *getEntries() {
    this.entries = yield getDirEntries(this)
  }
}

export default Dir
