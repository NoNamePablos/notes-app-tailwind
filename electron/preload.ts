import { contextBridge } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolated must be enabled in Window')
}

try {
  contextBridge.exposeInMainWorld('context', {
    // todo
  })
} catch (error) {
  console.error(error)
}
