import { makeAutoObservable, runInAction } from 'mobx'

import Dir from './Dir'
import File from './File'
import { getDirEntries } from './_utils'

type Entry = Dir | File

class Store {
  rootDir?: Dir
  currentDir?: Dir

  constructor() {
    makeAutoObservable(this)
  }

  get currentDirStack() {
    if (this.currentDir === undefined) throw new Error('Current Dir is not set...')

    const stack = []
    let currentDir = this.currentDir

    while (currentDir.parent) {
      currentDir = currentDir.parent
      stack.unshift(currentDir)
    }

    return stack
  }

  changeDir(dir: Dir) {
    this.currentDir = dir

    dir.getEntries()
  }

  setRootDir(rootHandle: FileSystemDirectoryHandle) {
    const rootDir = new Dir(rootHandle)

    this.rootDir = rootDir
    this.changeDir(rootDir)
  }

  async goToPath(path: string) {
    if (this.rootDir === undefined) throw new Error('Root Dir is not set...')

    const dirNames = path.split('/').filter(Boolean)
    let currentDir = this.rootDir

    for (let dirName of dirNames) {
      const entries: Entry[] = await getDirEntries(currentDir)
      const entry = entries
        .filter((entry): entry is Dir => entry instanceof Dir)
        .find((dirEntry) => dirEntry.handle.name === dirName)

      if (entry === undefined) throw new Error('Path does not exist...')

      currentDir = entry
    }

    runInAction(() => {
      this.changeDir(currentDir)
    })
  }
}

export default Store
export type { Entry }
