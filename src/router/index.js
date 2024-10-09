import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: "WALTER CLAYTON",
      subtitle: 'I Build Dynamic and Custom Web Solutions',
      description: 'I am a web developer who specializes in building custom web solutions for businesses and individuals. I am passionate about creating dynamic and engaging websites that help my clients achieve their goals.',
      buttons: [
        { text: 'Discover My Work', link: '#work', class: 'btn-primary' },
        { text: 'Get a Quote', link: '#contact', class: 'btn-secondary' }
      ],
      svg: 'HomeSVG'
    }
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: () => import('../views/PortfolioView.vue'),
    meta: {
      title: 'My Projects',
      subtitle: 'Explore the work I\'ve done in web development',
      svg: 'PortfolioSVG'
    },
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/BlogView.vue'),
    meta: {
      title: 'Walter Clayton',
      subtitle: 'Discover my blog posts',
      svg: 'BlogSVG'
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      title: 'About Walter Clayton',
      subtitle: 'Learn more about my journey and interests',
      svg: 'AboutSVG'
    },
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
