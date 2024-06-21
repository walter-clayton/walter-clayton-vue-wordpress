import '@/assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueGtag from 'vue-gtag';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Environment-based conditional logic
if (import.meta.env.VITE_APP_ENVIRONMENT === 'staging') {
  const username = prompt('Please enter your username:');
  const password = prompt('Please enter your password:');

  const expectedUsername = import.meta.env.VITE_APP_EXPECTED_USERNAME;
  const expectedPassword = import.meta.env.VITE_APP_EXPECTED_PASSWORD;

  if (username !== expectedUsername || password !== expectedPassword) {
    alert('Access denied');
    window.close();
  } else {
    const app = createApp(App);
    app.use(router).use(VueGtag, {
      config: {
        id: 'G-RMZ2CZEMX8',
        params: {
          anonymize_ip: true, // Anonymize IP addresses for all events
        },
      },
    }).mount('#app');
  }
} else {
  const app = createApp(App);
  app.use(router).use(VueGtag, {
    config: {
      id: 'G-RMZ2CZEMX8',
      params: {
        anonymize_ip: true,
      },
    },
  }).mount('#app');
}
