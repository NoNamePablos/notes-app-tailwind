<script setup lang="ts">
import { Upload } from 'lucide-vue-next'

defineOptions({
  name: 'NewNoteButton'
})
</script>

<template>
  <UiButtonAction>
    <Upload class="w-4 h-4 text-zinc-300" />
  </UiButtonAction>
</template>

<style scoped></style>
