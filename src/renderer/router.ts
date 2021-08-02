import { createRouter, createMemoryHistory } from 'vue-router'
import loginIndex from '/@/components/login-index.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      component: loginIndex
    }
  ]
})

export default router
