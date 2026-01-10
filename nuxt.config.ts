import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineNuxtConfig({
  compatibilityDate: '2024-01-10',
  
  ssr: false,

  typescript: {
    strict: false,
    typeCheck: false
  },

  app: {
    head: {
      title: 'TaskMaster Pro',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})