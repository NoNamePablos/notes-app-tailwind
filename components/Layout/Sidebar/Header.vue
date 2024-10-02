<script setup lang="ts">
import useNotesStore from '@/store/modules/notes'

const notesStore = useNotesStore()

const { deleteNote, createEmptyNote, loadNotes } = notesStore
</script>

<template>
  <div class="flex justify-between items-center">
    <UiButtonNewNote @click="createEmptyNote()" />
    <div class="flex gap-2">
      <UiButtonDeleteNote @click="deleteNote()" />
      <UiButtonReload @click="loadNotes()" />
    </div>
  </div>
</template>
