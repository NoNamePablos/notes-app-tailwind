<script lang="ts" setup>
const contentRef = ref<HTMLDivElement | null>(null)

const resetScroll = (): void => {
  nextTick(() => {
    if (contentRef.value?.$el instanceof HTMLElement) {
      contentRef.value.$el.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  })
}
</script>

<template>
  <div>
    <LayoutHeader />
    <main class="flex flex-row h-screen">
      <LayoutSidebar class="p-2">
        <NotePreviewList class="mt-3 space-y-1" @on-select="resetScroll()" />
      </LayoutSidebar>
      <LayoutContent ref="contentRef" class="border-l bg-zinc-900/50 border-l-white/50">
        <NuxtPage />
      </LayoutContent>
    </main>
  </div>
</template>
