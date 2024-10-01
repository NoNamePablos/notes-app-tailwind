<script setup lang="ts">
import useNotesStore from '@/store/modules/notes'
import { storeToRefs } from 'pinia'

const { t } = useI18n()

const { selectedNote } = storeToRefs(useNotesStore())

const currentTitle = computed<string>(() => selectedNote.value.title || t('app_first_window'))
</script>

<template>
  <div class="h-full">
    <NoteTilte :title="currentTitle" />
    <UiMarkdownEditor class="pt-2" />
  </div>
</template>

<style scoped></style>
