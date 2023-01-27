import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import VueCookies from 'vue-cookies'

createApp(App).use(router).use(VueCookies).mount('#app')

import "bootstrap/dist/js/bootstrap.js"
