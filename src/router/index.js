import { createRouter, createWebHashHistory } from 'vue-router'
import StatsComponent from "@/components/StatsComponent.vue";
import logOutComponent from "@/components/logOutComponent.vue";
import ServerStatsView from "@/views/ServerStatsView.vue";

const routes = [
  {
    path: '/',
    name: 'stats',
    component: StatsComponent
  },
  {
    path: '/serverstats',
    name: 'serverstats',
    component: ServerStatsView
  },
  {
    path: '/:pathMatch(.*)*',
    component: StatsComponent
  },
  {
    path: '/logout',
    name: 'logout',
    component: logOutComponent
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
