import { makeAutoObservable } from 'mobx'

class Dir {
  root: FileSystemDirectoryHandle | null = null
  current: FileSystemDirectoryHandle | null = null
  stack: FileSystemDirectoryHandle[] = []
  entries: FileSystemHandle[] = []

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
}

export default Dir
