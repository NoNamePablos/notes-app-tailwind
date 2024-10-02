import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { optimizer } from '@electron-toolkit/utils'
import path from 'path'
import { type Notes } from '@/types'
import { getNotes, readNote, writeNote, createNote, deleteNote } from '@/electron/lib'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

const preload = path.join(__dirname, 'preload.js')
const distPath = path.join(__dirname, '../.output/public')

let win: BrowserWindow | null = null

async function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    center: true,
    title: 'Note App',
    frame: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 15, y: 10 },
    webPreferences: {
      preload,
      sandbox: true,
      contextIsolation: true
    }
  })

  win.on('ready-to-show', () => {
    win?.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (app.isPackaged) {
    win.loadFile(path.join(distPath, 'index.html'))
  } else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  }
}

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('getNotes', (_, ...args: Parameters<Notes.GetNotes>) => getNotes(...args))
  ipcMain.handle('readNote', (_, ...args: Parameters<Notes.ReadNote>) => readNote(...args))
  ipcMain.handle('writeNote', (_, ...args: Parameters<Notes.WriteNote>) => writeNote(...args))
  ipcMain.handle('createNote', (_, ...args: Parameters<Notes.CreateNote>) => createNote(...args))
  ipcMain.handle('deleteNote', (_, ...args: Parameters<Notes.DeleteNote>) => deleteNote(...args))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
