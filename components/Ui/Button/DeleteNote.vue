<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'

defineOptions({
  name: 'DeleteNoteButton'
})
</script>

<template>
  <UiButtonAction>
    <Trash2 class="w-4 h-4 text-zinc-300" />
  </UiButtonAction>
</template>

<style scoped></style>
