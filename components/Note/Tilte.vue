<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex justify-center pt-2">
    <span class="text-gray-400" v-text="title" />
  </div>
</template>
