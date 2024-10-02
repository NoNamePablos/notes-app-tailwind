import { type Notes } from './models/Note'

declare global {
  interface Window {
    context: {
      locale: string
      getNotes: Notes.GetNotes
      readNote: Notes.ReadNote
      writeNote: Notes.WriteNote
      createNote: Notes.CreateNote
      deleteNote: Notes.DeleteNote
    }
  }
}
