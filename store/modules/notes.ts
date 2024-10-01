import { defineStore } from 'pinia'
import { type Notes } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export default defineStore('notes', () => {
  const notesData = reactive<Notes.Info[]>([
    {
      id: uuidv4(),
      title: 'Welcome',
      content: 'Hellow Welcome',
      lastEditTime: new Date().getTime()
    },
    {
      id: uuidv4(),
      title: 'Note 1',
      content: 'Hellow note 1',
      lastEditTime: new Date().getTime()
    },
    {
      id: uuidv4(),
      title: 'Note 2',
      content: 'Hellow note 2',
      lastEditTime: new Date().getTime()
    },
    {
      id: uuidv4(),
      title: 'Note 3',
      content: 'Hellow note 3',
      lastEditTime: new Date().getTime()
    },
    {
      id: uuidv4(),
      title: 'Note 4',
      content: 'Hellow note 4',
      lastEditTime: new Date().getTime()
    }
  ])

  const notes = computed<Notes.Info[]>(() => notesData)

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

    notesData.unshift(newNote)

    setSelectedNote(notesData[0])
  }

  const deleteNote = (note: Notes.Info): void => {
    const index = notesData.findIndex((noteItem: Notes.Info) => noteItem.id === note.id)

    if (index !== -1) {
      notesData.splice(index, 1)

      if (!notesData.length) {
        return
      }

      setSelectedNote(notesData[0])
    }
  }

  return {
    notes,
    selectedNote,
    setSelectedNote,
    createEmptyNote,
    deleteNote
  }
})
