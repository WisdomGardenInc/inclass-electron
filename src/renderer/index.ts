import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import store from './store'
import { Request } from './assets/js/request'
import VueAxios from 'vue-axios'
import i18n from '../language/i18n.js'

const app = createApp(App as any)

app.use(router)
app.use(store)
app.use(VueAxios, Request.init())
app.use(i18n)

app.mount('#app')
