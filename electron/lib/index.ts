import { homedir } from 'os'
import { ensureDir, readdir, stat } from 'fs-extra'
import { type Notes } from '@/types'
import { v4 as uuidv4 } from 'uuid'

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
