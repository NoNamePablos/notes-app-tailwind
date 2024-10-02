import { defineStore } from 'pinia'
import { type Notes } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export default defineStore('notes', () => {
  const notesData = ref<Notes.Info[]>([])

  const loadNotes = async (): Promise<Notes.Info[]> => {
    const notes = (await window.context.getNotes()) as Notes.Info[]
    notesData.value = notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
  }

  const notes = computed<Notes.Info[]>(() => notesData.value)

  const selectedNote = reactive<Notes.Info>({
    id: '',
    title: '',
    content: '',
    lastEditTime: 0
  })

  const setSelectedNote = async (note: Notes.Info): Promise<void> => {
    const { id, title, lastEditTime } = note

    const noteContent = await window.context.readNote(title)

    selectedNote.id = id || ''
    selectedNote.title = title || ''
    selectedNote.lastEditTime = lastEditTime || 0
    selectedNote.content = noteContent || ''
  }

  const createEmptyNote = async (): Promise<void> => {
    const title = await window.context.createNote()

    if (!title) {
      return
    }

    const newNote: Notes.Info = {
      id: uuidv4(),
      title,
      content: '',
      lastEditTime: Date.now()
    }

    notesData.value.unshift(newNote)

    setSelectedNote(notesData.value[0])
  }

  const deleteNote = async (): Promise<void> => {
    if (!selectedNote || !notesData.value) {
      return
    }

    const isDeleted = await window.context.deleteNote(selectedNote.title)

    if (!isDeleted) {
      return
    }

    await loadNotes()

    if (notesData.value) {
      setSelectedNote(notesData.value[0])
    }
  }

  const saveNote = async (content: Notes.Content): Promise<void> => {
    if (!selectedNote || !notes.value) {
      return
    }

    await window.context.writeNote(selectedNote.title, content)

    notesData.value.map((note) => {
      if (note.title === selectedNote.title) {
        return {
          ...note,
          lastEditTime: Date.now()
        }
      }

      return note
    })
  }

  return {
    notes,
    selectedNote,
    setSelectedNote,
    createEmptyNote,
    deleteNote,
    loadNotes,
    saveNote
  }
})
