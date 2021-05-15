export const getDirectoryEntries = async (directoryHandle: FileSystemDirectoryHandle) => {
  const entries: Array<FileSystemHandle> = []

  for await (let [, handler] of directoryHandle.entries()) {
    entries.push(handler)
  }

  return entries
}

export const downloadFile = (file: File, name: string) => {
  const link = document.createElement('a')
  const url = window.URL.createObjectURL(file)
  link.href = url
  link.setAttribute('download', name)
  link.click()
}
