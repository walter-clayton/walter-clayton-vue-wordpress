<script setup>
import { ref } from 'vue'
import TheJumbotron from '../components/TheJumbotron.vue'
import FooterComponent from '../components/FooterComponent.vue'
import CardComponent from '../components/CardComponent.vue'
import projectsData from '@/assets/projects.json'

const projects = ref(projectsData)
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
