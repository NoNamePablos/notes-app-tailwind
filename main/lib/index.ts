import { homedir } from 'os'
import { ensureDir, readdir, stat } from 'fs-extra'
import { type Notes } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export const getRootDir = (): string => {
  const { appDirectoryName } = useRuntimeConfig().public
  return `${__dirname}/${appDirectoryName}`
}

export const getNotes = async (): Promise<Notes.Info[]> => {
  const { fileEncoding } = useRuntimeConfig().public

  const rootDir = getRootDir()

  await ensureDir(rootDir)

  // Чтение содержимого директории
  const notesFileNames = await readdir(rootDir, {
    encoding: 'utf8',
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName: string) => fileName.endsWith('.md'))

  return Promise.all(notes.map(getNoteInfoFromFile))
}

export const getNoteInfoFromFile = async (filename: string): Promise<Notes.Info> => {
  const fileStats = await stat(`${getRootDir()}/${filename}`)
  return {
    id: uuidv4(),
    title: filename.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}
