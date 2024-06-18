<script setup>
import { ref } from 'vue'
import TheJumbotron from '../components/TheJumbotron.vue'
import FooterComponent from '../components/FooterComponent.vue'
import CardComponent from '../components/CardComponent.vue'
import projectsData from '@/assets/projects.json'

// Function to resolve image paths dynamically
const resolveImagePath = (path) => {
  if (!path) {
    console.error('Path is undefined or empty')
    return ''
  }
  const resolvedPath = new URL(`../assets/${path.split('/').pop()}`, import.meta.url).href
  console.log(`Resolving path: original=${path}, resolved=${resolvedPath}`)
  return resolvedPath
}

// Resolve image paths in projects data
const projects = ref(projectsData.map(project => {
  if (project.featureImage) {
    project.featureImage = resolveImagePath(project.featureImage)
  } else {
    console.warn(`Project "${project.title}" does not have a featureImage`)
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
