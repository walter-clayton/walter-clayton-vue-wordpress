<script setup>
import { ref } from 'vue'
import TheJumbotron from '../components/TheJumbotron.vue'
import FooterComponent from '../components/FooterComponent.vue'
import CardComponent from '../components/CardComponent.vue'
import projectsData from '@/assets/projects.json'

// Function to resolve image paths dynamically
const resolveImagePath = (path) => {
  if (!path) return ''
  return new URL(`../assets/${path.split('/').pop()}`, import.meta.url).href
}

// Resolve image paths in projects data
const projects = ref(projectsData.map(project => {
  if (project.featureImage) {
    project.featureImage = resolveImagePath(project.featureImage)
    console.log(`Resolved path for ${project.title}: ${project.featureImage}`) // Debugging log
  }
  return project
}))
</script>

<template>
  <main>
    <TheJumbotron />
    <section class="container">
      <CardComponent :projects="projects" />
    </section>
    <FooterComponent />
  </main>
</template>
