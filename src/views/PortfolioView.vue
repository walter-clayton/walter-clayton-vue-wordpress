<script setup>
import { ref } from 'vue'
import TheJumbotron from '../components/TheJumbotron.vue'
import FooterComponent from '../components/FooterComponent.vue'
import CardComponent from '../components/CardComponent.vue'
import projectData from '@/assets/projects.json'
import BackgroundBottomSVG from '../assets/svgs/BackgroundBottomSVG.vue';
import BackgroundTopSVG from '../assets/svgs/BackgroundTopSVG.vue';

// Create a ref for the project items
const projectItems = ref(projectData.map(project => ({ ...project })))
const isJumbotronLoaded = ref(false);

// Function to resolve image paths dynamically
const resolveImagePath = (path) => {
  return new URL(`../assets/${path.split('/').pop()}`, import.meta.url).href
}

// Update the featuredImage paths
projectItems.value.forEach(project => {
  if (project.featureImage) {
    project.featureImage = resolveImagePath(project.featureImage)
  }
})

// Handler for when the Jumbotron is loaded
const handleJumbotronLoaded = () => {
  isJumbotronLoaded.value = true;
};
</script>

<template>
  <main>
    <TheJumbotron @loaded="handleJumbotronLoaded"/>
    <BackgroundTopSVG />
    <section v-if="isJumbotronLoaded" class="container">
      <CardComponent :projects="projectItems" />
    </section>
    <BackgroundBottomSVG />
    <FooterComponent />
  </main>
</template>
