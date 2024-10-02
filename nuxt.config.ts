import { fileURLToPath } from 'url'
import fs from 'node:fs'
import path from 'node:path'
import pkg from './package.json'

fs.rmSync(path.join(__dirname, 'dist-electron'), { recursive: true, force: true })

const viteElectronBuildConfig = {
  build: {
    minify: process.env.NODE_ENV === 'production',
    rollupOptions: {
      external: Object.keys('dependencies' in pkg ? pkg.dependencies : {})
    }
  },
  resolve: {
    alias: {
      '@': __dirname
    }
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,
  experimental: {
    appManifest: false
  },
  devtools: { enabled: true },
  alias: {
    '@img': fileURLToPath(new URL('./assets/images', import.meta.url)),
    '@icons': fileURLToPath(new URL('./assets/icons', import.meta.url)),
    '@assets': fileURLToPath(new URL('./assets', import.meta.url)),
    '@configs': fileURLToPath(new URL('./core/configs', import.meta.url)),
    '@store': fileURLToPath(new URL('./store', import.meta.url)),
    '@utils': fileURLToPath(new URL('./utils', import.meta.url))
  },
  modules: ['nuxt-electron', '@nuxtjs/eslint-module', '@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/i18n'],
  runtimeConfig: {
    public: {
      baseApiUrl: process.env.API_BASE_URL,
      baseFullUrl: process.env.BASE_FULL_URL,
      nodeEnv: process.env.APP_NODE_ENV,
      isProduction: process.env.APP_NODE_ENV === 'production',
      appDirectoryName: process.env.APP_DIRECTORY_NAME || 'notes-app-tailwind',
      fileEncoding: process.env.APP_FILE_ENCODING || 'utf8'
    }
  },
  css: ['@/assets/styles/index.scss'],
  i18n: {
    locales: [
      { code: 'en', name: 'English', language: 'en-US', file: 'en.ts' },
      { code: 'ru', name: 'Russian', language: 'ru-RU', file: 'ru.ts' }
    ],
    langDir: 'locales',
    lazy: true,
    defaultLocale: 'en'
  },
  electron: {
    build: [
      {
        entry: 'electron/main.ts',
        vite: viteElectronBuildConfig
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          options.reload()
        },
        vite: viteElectronBuildConfig
      }
    ]
  }
})
