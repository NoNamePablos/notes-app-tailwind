<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

defineOptions({
  name: 'ActionButton'
})
</script>

<template>
  <button
    :class="
      twMerge('px-2 py-1 rounded-md border border-zinc-400/50 hover:bg-zinc-600/50 transition-colors duration-100')
    "
  >
    <slot />
  </button>
</template>

<style scoped></style>
