<script setup>
import { Bars3Icon } from '@heroicons/vue/24/outline';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import Logo from './icons/IconLogo.vue';

const isMenuOpen = ref(false);
const route = useRoute();

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Handle clicking outside of the menu to close it
const handleClickOutside = (e) => {
  const menu = document.getElementById('mobile-menu');
  const menuButton = document.querySelector('button[aria-controls="mobile-menu"]');
  if (menu && menuButton && !menu.contains(e.target) && !menuButton.contains(e.target)) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>


<template>
  <nav class="bg-[#EEEAE2] font-avenir tracking-widest">
    <div class="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="flex items-center justify-between flex-1 sm:justify-start">
          <div class="flex items-center">
            <a href="/" class="flex items-center">
            <Logo />
            </a>
          </div>
          <!-- Mobile menu button-->
          <button
            type="button"
            @click="toggleMenu"
            class="relative inline-flex items-center justify-center p-2 sm:hidden"
            aria-controls="mobile-menu"
            aria-expanded="false"
            aria-label="Toggle menu"
          >
            <Bars3Icon v-if="!isMenuOpen" class="block w-6 h-6" />
            <!-- X icon -->
            <svg
              v-if="isMenuOpen"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path
                fill-rule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <RouterLink
                to="/"
                :class="`px-3 py-2 text-base font-medium hover:font-bold hover:underline ${route.path === '/' ? 'underline' : ''}`"
              >
                HOME
              </RouterLink>
              <RouterLink
                to="/blog"
                :class="`px-3 py-2 text-base font-medium hover:font-bold hover:underline ${route.path === '/blog' ? 'underline' : ''}`"
              >
                BLOG
              </RouterLink>
              <RouterLink
                to="/portfolio"
                :class="`px-3 py-2 text-base font-medium hover:font-bold hover:underline ${route.path === '/portfolio' ? 'underline' : ''}`"
              >
                PORTFOLIO
              </RouterLink>
              <RouterLink
                to="/about"
                :class="`px-3 py-2 text-base font-medium hover:font-bold hover:underline ${route.path === '/about' ? 'underline' : ''}`"
              >
                ABOUT
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div v-if="isMenuOpen" class="sm:hidden" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <RouterLink
          @click="toggleMenu"
          to="/"
          :class="`block px-3 py-2 text-base font-medium hover:font-bold hover:underline ${route.path === '/' ? 'underline' : ''}`"
        >
          HOME
        </RouterLink>
        <RouterLink
          @click="toggleMenu"
          to="/blog"
          :class="`block px-3 py-2 text-base font-medium hover:font-bold hover:underline ${route.path === '/blog' ? 'underline' : ''}`"
        >
          BLOG
        </RouterLink>
        <RouterLink
          @click="toggleMenu"
          to="/portfolio"
          :class="`block px-3 py-2 text-base font-medium hover:font-bold hover:underline ${route.path === '/portfolio' ? 'underline' : ''}`"
        >
          PORTFOLIO
        </RouterLink>
        <RouterLink
          @click="toggleMenu"
          to="/about"
          :class="`block px-3 py-2 text-base font-medium hover:font-bold hover:underline ${route.path === '/about' ? 'underline' : ''}`"
        >
          ABOUT
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
