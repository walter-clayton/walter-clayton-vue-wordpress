import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: ["WALTER CLAYTON"],
      subtitle: 'Creating websites that engage and convert.',
      description: "I build custom websites that captivate your audience and deliver measurable results. Let's craft a digital experience that helps your business grow.",
      buttons: [
        { text: 'Discover My Portfolio', link: '#work-section', class: 'px-5 py-2 m-2 btn-primary' },
        { text: 'Request a Free Consultation', link: '#ComingSoon', class: 'px-5 py-2 m-2 btn-secondary' }
      ],
      svg: 'HomeSVG'
    }
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: () => import('../views/PortfolioView.vue'),
    meta: {
      title: ['Featured Work'],
      subtitle: "Showcasing my web solutions and creative endeavors.",
      description: "I design websites and apps that bring ideas to life and help businesses succeed.",
      buttons: [
        { text: 'View My Portfolio', link: '#portfolio-section', class: 'px-5 py-2 m-2 btn-primary' },
        { text: 'Discover My Skills', link: '#ComingSoon', class: 'px-5 py-2 m-2 btn-secondary' }
      ],
      svg: 'PortfolioSVG'
    },
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/BlogView.vue'),
    meta: {
      title: ['Digital Diary'],
      subtitle: 'Web development, tech challenges, and more...',
      description: "Read about my latest thoughts on web development and project updates.",
      buttons: [
        { text: 'Explore All Blog Posts', link: '#blog-section', class: 'px-5 py-2 m-2 btn-primary' },
        { text: 'Get the Latest Updates', link: '#ComingSoon', class: 'px-5 py-2 m-2 btn-secondary' }
      ],
      svg: 'BlogSVG'
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      title: ['Shaping Digital Experiences'],
      subtitle: 'From Self-Taught Coder to Web Architect',
      description: "I started as a self-taught coder and grew into a web architect, driven by curiosity and a passion for problem-solving. Every project I take on is an opportunity to create something meaningful for businesses.",
      buttons: [
        { text: 'Read My Full Story', link: '#story-section', class: 'px-5 py-2 m-2 btn-primary' },
        { text: 'See My Work in Action', link: '#ComingSoon', class: 'px-5 py-2 m-2 btn-secondary' }
      ],
      svg: 'AboutSVG'
    },
  },
  {
    path: '/post/:slug',
    name: 'post',
    component: () => import('../components/ThePost.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    } else {
      return { top: 0 };
    }
  },
});

export default router;
