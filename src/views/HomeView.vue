<!-- Home.vue -->
<script setup>
import { ref } from 'vue';
import TheJumbotron from '@/components/TheJumbotron.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import CardComponent from '@/components/CardComponent.vue';
import projectData from '@/assets/projects.json';
import BackgroundBottomSVG from '../assets/svgs/BackgroundBottomSVG.vue';
import BackgroundTopSVG from '../assets/svgs/BackgroundTopSVG.vue';

// Create a ref for the project items
const projectItems = ref(projectData);
const isJumbotronLoaded = ref(false);

const handleJumbotronLoaded = () => {
  isJumbotronLoaded.value = true;
};
</script>

<template>
  <main>
    <TheJumbotron @loaded="handleJumbotronLoaded" />
    <BackgroundTopSVG />
    <section v-if="isJumbotronLoaded" class="container">
      <CardComponent :projects="projectItems" />
    </section>
    <BackgroundBottomSVG />
    <FooterComponent />
  </main>
</template>
