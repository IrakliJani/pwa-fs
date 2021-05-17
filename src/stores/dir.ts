import { observable, makeObservable, flow, computed } from 'mobx'

import { getDirectoryEntries } from './../utils'

class Dir {
  root: FileSystemDirectoryHandle | null = null
  current: FileSystemDirectoryHandle | null = null
  stack: FileSystemDirectoryHandle[] = []
  entries: FileSystemHandle[] = []

  constructor() {
    makeObservable(this, {
      root: observable,
      current: observable,
      stack: observable,
      entries: observable,

      parentDirHandle: computed,

      setCurrentDirAndEntries: flow,
      setRootDir: flow,
      changeToParentDir: flow,
      changeDir: flow,
      goToPath: flow,
    })
  }

  get parentDirHandle() {
    const currentDirIndex = this.stack.findIndex((d) => d === this.current)
    return this.stack[currentDirIndex - 1]
  }

  *setCurrentDirAndEntries(dirHandle: FileSystemDirectoryHandle) {
    this.entries = yield getDirectoryEntries(dirHandle)
    this.current = dirHandle
  }

  *setRootDir(rootHandle: FileSystemDirectoryHandle) {
    yield this.setCurrentDirAndEntries(rootHandle)
    this.root = rootHandle
    this.stack.push(rootHandle)
  }

  *changeToParentDir(dirHandle: FileSystemDirectoryHandle) {
    const index = this.stack.findIndex((d) => d === dirHandle)

    yield this.setCurrentDirAndEntries(dirHandle)
    this.stack.splice(index + 1)
  }

  *changeDir(dirHandle: FileSystemDirectoryHandle) {
    yield this.setCurrentDirAndEntries(dirHandle)
    this.stack.push(dirHandle)
  }

  *goToPath(path: string) {
    const dirNames = path.split('/').filter(Boolean)
    let currentHandle = this.root!
    let stack = [currentHandle]

    for (let dirName of dirNames) {
      const entries: FileSystemHandle[] = yield getDirectoryEntries(currentHandle)
      const entry = entries
        .filter((entry) => entry.kind === 'directory')
        .find((entry) => entry.name === dirName) as FileSystemDirectoryHandle | undefined

      if (!entry) throw new Error('Path does not exist...')

      currentHandle = entry
      stack.push(entry)
    }

    yield this.setCurrentDirAndEntries(currentHandle)
    this.stack = stack
  }
}

export default Dir
