import { makeAutoObservable } from 'mobx'

import Dir from './Dir'
import File from './File'
import { getDirEntries } from './_utils'

type Entry = Dir | File

class State {
  root?: Dir
  current?: Dir

  constructor() {
    makeAutoObservable(this)
  }

  get stack() {
    if (!this.current) return []

    const stack = [this.current]
    let current = this.current

    while (current.parent) {
      current = current.parent
      stack.push(current)
    }

    return stack.reverse()
  }

  changeDir(dir: Dir) {
    this.current = dir

    dir.getEntries()
  }

  setRootDir(rootHandle: FileSystemDirectoryHandle) {
    const root = new Dir(rootHandle)

    this.root = root
    this.changeDir(root)
  }

  *goToPath(path: string) {
    if (!this.root) throw new Error('Root folder does not exist...')

    const dirNames = path.split('/').filter(Boolean)
    let current = this.root

    for (let dirName of dirNames) {
      const entries: Array<Entry> = yield getDirEntries(current)
      const entry = entries
        .filter((entry) => entry instanceof Dir)
        .find((dirEntry) => dirEntry.handle.name === dirName) as Dir

      if (!entry) throw new Error('Path does not exist...')

      current = entry
    }

    this.changeDir(current)
  }
}

export default State
export type { Entry }
