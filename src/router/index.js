import { createRouter, createWebHashHistory } from 'vue-router'
import logOutComponent from "@/components/logOutComponent.vue";
import ServerView from "@/views/ServerView.vue";
import UserView from "@/views/UserView.vue";
import LoginComponent from "@/components/loginComponent.vue";
import serverOverviewComponent from "@/components/ServerOverviewComponent.vue";
import pageNotFoundComponent from "@/components/pageNotFoundComponent.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";


const routes = [
  {
    path: '/serverOverview',
    name: 'serverOverview',
    component: serverOverviewComponent,
    meta: {
        authRequired: true
    }
  },
  {
    path: '/serverstats',
    name: 'serverstats',
    component: ServerView,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    component: pageNotFoundComponent
  },
  {
    path: '/logout',
    name: 'logout',
    component: logOutComponent,
  },
  {
    path: '/userView',
    name: 'userView',
    component: UserView,
    meta: {
      authRequired: true
    }
  },
  {
    path: '/',
    name: 'login',
    component: LoginComponent
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach( (to, from, next) => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (to.matched.some(record => record.meta.authRequired)) {
            if (user) {
                next()
            } else {
                alert("Please log in first!")
                next({
                    path: '/login',
                })
            }
        } else {
            next()
        }
    });
})

export default router