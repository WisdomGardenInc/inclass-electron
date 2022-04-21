import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import 'ant-design-vue/lib/message/style/index.css'
import 'ant-design-vue/lib/modal/style/index.css'
import 'ant-design-vue/lib/button/style/index.css'
import 'uno.css'
import router from './router'
import { Request } from './assets/js/request'
import VueAxios from 'vue-axios'
import i18n from '../language/i18n.js'
import { Button } from 'ant-design-vue';


const app = createApp(App as any)

app.use(router)
app.use(Button)
app.use(VueAxios, Request.init())
app.use(i18n)

app.mount('#app')
