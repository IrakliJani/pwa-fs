import { makeObservable, observable, flow } from 'mobx'
import { getDirEntries } from './../utils'

class Entry {
  entry: FileSystemDirectoryHandle | null = null
  subEntries: FileSystemHandle[] | null = null

  constructor(entry: FileSystemDirectoryHandle) {
    makeObservable(this, {
      entry: observable,
      subEntries: observable,

      getSubEntries: flow,
    })

    this.entry = entry
  }

  *getSubEntries() {
    this.subEntries = yield getDirEntries(this.entry!)
  }
}

export default Entry
