import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import VueGtag from 'vue-gtag';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('./views/HomeView.vue') },
    { path: '/post/:id', name: 'post', component: () => import('./components/ThePost.vue') },
  ],
});

const app = createApp(App);

app.use(router);

app.use(VueGtag, {
  config: { 
    id: 'G-RMZ2CZEMX8',
    params: {
      anonymize_ip: true // Anonymize IP addresses for all events
    }
  }
});

app.mount('#app');
