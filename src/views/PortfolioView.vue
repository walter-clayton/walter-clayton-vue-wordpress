<script setup>
import { ref } from 'vue'
import TheJumbotron from '../components/TheJumbotron.vue'
import FooterComponent from '../components/FooterComponent.vue'
import CardComponent from '../components/CardComponent.vue'
import projectData from '@/assets/projects.json'

// Create a ref for the project items
const projectItems = ref(projectData)
const isJumbotronLoaded = ref(false);

// Handler for when the Jumbotron is loaded
const handleJumbotronLoaded = () => {
  isJumbotronLoaded.value = true;
};
</script>

<template>
  <main>
    <TheJumbotron @loaded="handleJumbotronLoaded"/>
    <section v-if="isJumbotronLoaded" class="container">
      <CardComponent :projects="projectItems" />
    </section>
    <FooterComponent />
  </main>
</template>
