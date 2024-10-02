import { homedir } from 'os'
import { ensureDir, readdir, stat, readFile, writeFile, remove } from 'fs-extra'
import { type Notes } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { dialog } from 'electron'
import path from 'path'

export const getRootDir = (): string => {
  return `${__dirname}/notes-app-tailwind`
}

export const getNoteInfoFromFile = async (filename: string): Promise<Notes.Info> => {
  console.log('getRootDir: ', getRootDir)
  const fileStats = await stat(`${getRootDir()}/${filename}`)
  return {
    id: uuidv4(),
    title: filename.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const getNotes: Notes.GetNotes = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  try {
    const notesFileNames = await readdir(rootDir, {
      encoding: 'utf8',
      withFileTypes: false
    })

    const notes = notesFileNames.filter((fileName: string) => fileName.endsWith('.md'))

    const noteDetails = await Promise.all(notes.map(getNoteInfoFromFile))

    return noteDetails
  } catch (error) {
    console.error('Error in getNotes:', error)
    throw error
  }
}

export const readNote: Notes.ReadNote = async (filename) => {
  const rootDir = getRootDir()

  return readFile(`${rootDir}/${filename}.md`, { encoding: 'utf8' })
}

export const writeNote: Notes.WriteNote = async (filename, content) => {
  const rootDir = getRootDir()

  console.info(`Writing note ${filename} to ${rootDir}`)
  return writeFile(`${rootDir}/${filename}.md`, content, { encoding: 'utf8' })
}

export const createNote: Notes.CreateNote = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'New Note',
    defaultPath: `${rootDir}/${uuidv4()}.md`,
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })

  if (canceled || !filePath) {
    console.info(`Note create canceled`)
    return false
  }

  const { name: filename, dir: parentDir } = path.parse(filePath)

  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Creation failed',
      message: `All notes must be saved under ${rootDir}`
    })

    return false
  }
  console.info(`Creating note ${filePath}`)
  await writeFile(filePath, '')

  return filename
}

export const deleteNote: Notes.DeleteNote = async (filename) => {
  const rootDir = getRootDir()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete Note',
    message: `Delete  ${filename} ?`,
    buttons: ['Удалить', 'Отмена'],
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    console.info('Note Deletion canceled')
    return false
  }

  console.info(`Deleting note ${filename}`)
  await remove(`${rootDir}/${filename}.md`)
  return true
}
