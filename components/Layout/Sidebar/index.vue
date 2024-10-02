<template>
  <aside class="w-[250px] mt-10 h-[100vh + 10px] overflow-auto">
    <h1 class="text-2xl font-bold border-b border-b-white/50 text-center pb-1 mb-2" v-text="$t('app_title')" />
    <LayoutSidebarHeader class="mt-1 mb-4" />
    <slot />
  </aside>
</template>
