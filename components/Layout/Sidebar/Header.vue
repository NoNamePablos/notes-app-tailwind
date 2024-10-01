<script setup lang="ts">
import useNotesStore from '@/store/modules/notes'
import { storeToRefs } from 'pinia'

const notesStore = useNotesStore()

const { deleteNote, createEmptyNote } = notesStore

const { selectedNote } = storeToRefs(useNotesStore())
</script>

<template>
  <div class="flex justify-between items-center">
    <UiButtonNewNote @click="createEmptyNote()" />
    <UiButtonDeleteNote @click="deleteNote(selectedNote)" />
  </div>
</template>

<style scoped></style>
