<template>
  <main>
    <TheJumbotron @loaded="handleJumbotronLoaded" />
    <BackgroundTopSVG />
    <section class="container flex flex-col items-center px-4 mx-auto my-12">
      <CardComponent
        v-if="projectItems"
        :projects="projectItems"
        class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      />
      <div v-else>Loading...</div>
    </section>
    <BackgroundBottomSVG />
    <FooterComponent />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TheJumbotron from '../components/TheJumbotron.vue'
import FooterComponent from '../components/FooterComponent.vue'
import CardComponent from '../components/CardComponent.vue'
import BackgroundBottomSVG from '../assets/svgs/BackgroundBottomSVG.vue'
import BackgroundTopSVG from '../assets/svgs/BackgroundTopSVG.vue'

const projectItems = ref(null)
const isJumbotronLoaded = ref(false)
// Fetch project items asynchronously
const loadProjectItems = async () => {
  try {
    const response = await fetch('/assets/projects.json');
    if (response.ok) {
      const data = await response.json();
      projectItems.value = data;
    } else {
      console.error('Failed to load project data:', response.statusText);
    }
  } catch (error) {
    console.error('Error loading project data:', error);
  }
}

// Handler for when the Jumbotron is loaded
const handleJumbotronLoaded = () => {
  isJumbotronLoaded.value = true;
}

// Start loading project items on mount
onMounted(() => {
  loadProjectItems();
})
</script>