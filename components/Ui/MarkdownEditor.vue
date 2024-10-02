<script setup lang="ts">
import { ref } from 'vue'
import { MdEditor, config } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import ru_RU from '@vavt/cm-extension/dist/locale/ru'
import useNotesStore from '@/store/modules/notes'
import { storeToRefs } from 'pinia'

const { selectedNote } = storeToRefs(useNotesStore())

config({
  editorConfig: {
    languageUserDefined: {
      ru: ru_RU
    }
  }
})

const { locale } = useI18n()

const markDownLanguage = computed<string>(() => (locale.value === 'ru' ? 'ru' : 'en-US'))

const text = ref<string>()

watch(
  () => selectedNote,
  () => {
    text.value = selectedNote.value.content
  },
  {
    deep: true
  }
)
</script>

<template>
  <div class="markdown-editor h-full">
    <MdEditor v-model="text" :language="markDownLanguage" theme="dark" />
  </div>
</template>

<style scoped lang="scss">
.md-editor {
  @apply h-full;
}
.md-editor-dark {
  --md-bk-color: transparent !important;
}
</style>
