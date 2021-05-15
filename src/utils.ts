export const getDirectoryEntries = async (directoryHandle: FileSystemDirectoryHandle) => {
  const entries: Array<FileSystemHandle> = []

  for await (let [, handler] of directoryHandle.entries()) {
    entries.push(handler)
  }

  return entries
}
