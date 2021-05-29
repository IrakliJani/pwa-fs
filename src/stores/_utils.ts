import Dir from './Dir'
import File from './File'
import { Entry } from './Store'

const getDirEntries = async (dir: Dir): Promise<Entry[]> => {
  const entries: Entry[] = []

  for await (let handle of dir.handle.values()) {
    if (handle instanceof FileSystemDirectoryHandle) {
      entries.push(new Dir(handle, dir))
    } else if (handle instanceof FileSystemFileHandle) {
      entries.push(new File(handle, dir))
    }
  }

  return entries
}

const downloadFile = (file: globalThis.File, name: string): void => {
  const link = document.createElement('a')
  const url = window.URL.createObjectURL(file)
  link.href = url
  link.setAttribute('download', name)
  link.click()
}

export { getDirEntries, downloadFile }
