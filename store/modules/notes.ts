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

  const setSelectedNote = (note: Notes.Info): void => {
    const { id, title, lastEditTime, content } = note

    selectedNote.id = id || ''
    selectedNote.title = title || ''
    selectedNote.content = content || ''
    selectedNote.lastEditTime = lastEditTime || 0
  }

  const createEmptyNote = (): void => {
    const title = `Note ${notes.value.length + 1}`

    const newNote: Notes.Info = {
      id: uuidv4(),
      title,
      content: '',
      lastEditTime: Date.now()
    }

    notesData.value.unshift(newNote)

    setSelectedNote(notesData.value[0])
  }

  const deleteNote = (note: Notes.Info): void => {
    const index = notesData.value.findIndex((noteItem: Notes.Info) => noteItem.id === note.id)

    if (index !== -1) {
      notesData.value.splice(index, 1)

      if (!notesData.value.length) {
        return
      }

      setSelectedNote(notesData.value[0])
    }
  }

  return {
    notes,
    selectedNote,
    setSelectedNote,
    createEmptyNote,
    deleteNote,
    loadNotes
  }
})
