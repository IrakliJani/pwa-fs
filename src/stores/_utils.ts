import Dir from './Dir'
import File from './File'
import { Entry } from './Store'

const getDirEntries = async (dir: Dir): Promise<Entry[]> => {
  const entries: Entry[] = []

  for await (let [, handle] of dir.handle.entries()) {
    if (handle instanceof FileSystemDirectoryHandle) {
      entries.push(new Dir(handle, dir))
    } else if (handle instanceof FileSystemFileHandle) {
      entries.push(new File(handle, dir))
    }
  }

  return entries
}

const downloadFile = async (handle: FileSystemFileHandle) => {
  const link = document.createElement('a')
  const url = window.URL.createObjectURL(await handle.getFile())
  link.href = url
  link.setAttribute('download', handle.name)
  link.click()
}

export { getDirEntries, downloadFile }
