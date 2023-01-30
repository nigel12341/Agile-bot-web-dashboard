import { createRouter, createWebHashHistory } from 'vue-router'
import logOutComponent from "@/components/logOutComponent.vue";
import ServerView from "@/views/ServerView.vue";
import UserView from "@/views/UserView.vue";
import LoginComponent from "@/components/loginComponent.vue";
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import serverOverviewComponent from "@/components/ServerOverviewComponent.vue";

const routes = [
  {
    path: '/',
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
    component: ServerView
  },
  {
    path: '/logout',
    name: 'logout',
    component: logOutComponent,
    meta: {
      authRequired: true
    }
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
    path: '/login',
    name: 'login',
    component: LoginComponent
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAsFPkrCVt2w5vjzZ-JaajZvIjwSLfRwwE",
    authDomain: "agile-bot-2003.firebaseapp.com",
    projectId: "agile-bot-2003",
    storageBucket: "agile-bot-2003.appspot.com",
    messagingSenderId: "1014532189070",
    appId: "1:1014532189070:web:e3c3751ecabf85758312df"
  };
  initializeApp(firebaseConfig);
  // Initialize Firebase

  if (to.matched.some(record => record.meta.authRequired)) {
    if (getAuth().currentUser) {
      next();
    } else {
      alert('You must be logged in to see this page');
      next({
        path: '/login',
      });
    }
  } else {
    next();
  }

});

export default router