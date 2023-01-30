import { createRouter, createWebHashHistory } from 'vue-router'
import StatsComponent from "@/components/ServerOverviewComponent.vue";
import logOutComponent from "@/components/logOutComponent.vue";
import ServerView from "@/views/ServerView.vue";
import UserView from "@/views/UserView.vue";
import LoginComponent from "@/components/loginComponent.vue";

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
  },
  {
    path: '/userView',
    name: 'userView',
    component: UserView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginComponent
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router