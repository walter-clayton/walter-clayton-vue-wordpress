<script setup>
import { ref } from 'vue'
import TheJumbotron from '../components/TheJumbotron.vue'
import FooterComponent from '../components/FooterComponent.vue'
import CardComponent from '../components/CardComponent.vue'
import projectData from '@/assets/projects.json'

// Create a ref for the project items
const projectItems = ref(projectData.map(project => ({ ...project })))

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
</script>

<template>
  <main>
    <TheJumbotron />
    <section class="container">
      <CardComponent :projects="projectItems" />
    </section>
    <FooterComponent />
  </main>
</template>
