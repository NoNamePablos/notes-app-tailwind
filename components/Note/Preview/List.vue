<script setup lang="ts">
import useNotesStore from '@/store/modules/notes'
import { storeToRefs } from 'pinia'
import { Notes } from '@/types'

const notesStore = useNotesStore()

const { setSelectedNote } = notesStore

const { notes, selectedNote } = storeToRefs(useNotesStore())

interface Emits {
  (event: 'on-select'): void
}

const emit = defineEmits<Emits>()

const setSelected = (note: Notes.Info): void => {
  setSelectedNote(note)
  emit('on-select')
}
</script>

<template>
  <ul>
    <template v-if="!notes.length">
      <span class="inline-block w-full text-center pt-4" v-text="$t('no_notes_yet')" />
    </template>
    <template v-else>
      <li v-for="note in notes" :key="note.id">
        <NotePreviewItem :is-active="note.id === selectedNote.id" v-bind="note" @click="setSelected(note)" />
      </li>
    </template>
  </ul>
</template>
