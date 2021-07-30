import { createI18n } from 'vue-i18n'
import messages from './index.js'

const i18n = createI18n({
  locale: localStorage.lang || 'uk',
  messages
})

export default i18n
