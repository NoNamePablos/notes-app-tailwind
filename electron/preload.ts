import { contextBridge, ipcRenderer } from 'electron'
import { type Notes } from '@/types'

if (!process.contextIsolated) {
  throw new Error('contextIsolated must be enabled in Window')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    getNotes: (...args: Parameters<Notes.GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
    readNote: (...args: Parameters<Notes.ReadNote>) => ipcRenderer.invoke('readNote', ...args),
    writeNote: (...args: Parameters<Notes.WriteNote>) => ipcRenderer.invoke('writeNote', ...args)
  })
} catch (error) {
  console.error(error)
}
