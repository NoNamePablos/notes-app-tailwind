<script setup lang="ts">
import { RefreshCcw } from 'lucide-vue-next'

defineOptions({
  name: 'NewNoteButton'
})
</script>

<template>
  <UiButtonAction>
    <RefreshCcw class="w-4 h-4 text-zinc-300" />
  </UiButtonAction>
</template>
