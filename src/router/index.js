import { createRouter, createWebHashHistory } from 'vue-router'
import StatsComponent from "@/components/StatsComponent.vue";
import ServerStatsComponent from "@/components/ServerStatsComponent.vue";

const routes = [
  {
    path: '/',
    name: 'stats',
    component: StatsComponent
  },
  {
    path: '/serverstats',
    name: 'serverstats',
    component: ServerStatsComponent
  },
  {
    path: '/:pathMatch(.*)*',
    component: StatsComponent
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
