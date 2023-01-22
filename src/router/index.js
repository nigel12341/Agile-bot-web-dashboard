import { createRouter, createWebHashHistory } from 'vue-router'
import StatsComponent from "@/components/ServerOverviewComponent.vue";
import logOutComponent from "@/components/logOutComponent.vue";
import ServerView from "@/views/ServerView.vue";

const routes = [
  {
    path: '/',
    name: 'stats',
    component: StatsComponent
  },
  {
    path: '/serverstats',
    name: 'serverstats',
    component: ServerView
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
