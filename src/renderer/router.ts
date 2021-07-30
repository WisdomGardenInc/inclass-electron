import { createRouter, createMemoryHistory } from 'vue-router'
import Home from '/@/components/Home.vue'
import About from '/@/components/About.vue'
import loginIndex from '/@/components/login-index.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      component: loginIndex
    },
    {
      path: '/about',
      component: Home
    }
  ]
})

export default router
