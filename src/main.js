import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(),
  routes: [
      { path: '/', name: 'home', component: () => import('./views/HomeView.vue') },
      { path: '/post/:id', name: 'post', component: () => import('./components/ThePost.vue') },
    ],
  })

const app = createApp(App)

app.use(router)

app.mount('#app')
