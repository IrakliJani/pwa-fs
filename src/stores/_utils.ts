import Dir from './Dir'
import File from './File'
import { Entry } from './Store'

const getDirEntries = async (dir: Dir): Promise<Array<Entry>> => {
  const entries: Array<Entry> = []

  for await (let [, handle] of dir.handle.entries()) {
    if (handle instanceof FileSystemDirectoryHandle) {
      entries.push(new Dir(handle, dir))
    } else if (handle instanceof FileSystemFileHandle) {
      entries.push(new File(handle, dir))
    }
  }

  return entries
}

const downloadFile = async (file: File) => {
  const fileObject = await file.handle.getFile()
  const fileName = file.handle.name

  const link = document.createElement('a')
  const url = window.URL.createObjectURL(fileObject)
  link.href = url
  link.setAttribute('download', fileName)
  link.click()
}

export { getDirEntries, downloadFile }
