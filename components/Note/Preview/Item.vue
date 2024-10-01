<script setup lang="ts">
import { Notes } from '@/types'
import { formatDateFromMs } from '@/utils'

interface Props extends Notes.Info {
  isActive?: boolean
}

withDefaults(defineProps<Props>(), {
  isActive: false
})
</script>

<template>
  <div
    :class="
      cn('cursor-pointer px-2.5 py-3 rounded-md transition-colors duration-75', {
        'bg-zinc-400/75': isActive,
        'hover:bg-zinc-500/75': !isActive
      })
    "
  >
    <h3 class="mb-1 font-bold truncate" v-text="title" />
    <span class="inline-block w-full mb-2 text-xs font-light text-left" v-text="formatDateFromMs(lastEditTime)" />
  </div>
</template>
