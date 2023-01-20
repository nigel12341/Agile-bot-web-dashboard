import { createRouter, createWebHashHistory } from 'vue-router'
import StatsComponent from "@/components/StatsComponent.vue";

const routes = [
  {
    path: '/',
    name: 'stats',
    component: StatsComponent
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
