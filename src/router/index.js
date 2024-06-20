import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: "Welcome to Walter Clayton's Digital Space",
      subtitle: 'Explore the Intersection of Technology, Creativity, and Sports Science',
      description: 'Hi, I\'m Walter Clayton, a web developer with a passion for blending technology and creativity with sports science. Join me as I share my journey, projects, and insights aimed at making a positive impact through innovative digital solutions.',
      buttons: [
        { text: 'Discover My Projects', link: '/portfolio', class: 'btn-primary' },
        { text: 'Read My Blog', link: '/blog', class: 'btn-secondary' }
      ]
    }
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: () => import('../views/PortfolioView.vue'),
    meta: {
      title: 'My Projects',
      subtitle: 'Explore the work I\'ve done in web development'
    }
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/BlogView.vue'),
    meta: {
      title: 'Walter Clayton',
      subtitle: 'Discover my blog posts'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      title: 'About Walter Clayton',
      subtitle: 'Learn more about my journey and interests'
    }
  },
  {
    path: '/post/:id',
    name: 'post',
    component: () => import('../components/ThePost.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
