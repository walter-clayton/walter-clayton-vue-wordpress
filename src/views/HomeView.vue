<template>
  <main>
    <TheJumbotron @loaded="handleJumbotronLoaded" />
    <BackgroundTopSVG />
    <section v-if="projectItems && projectItems.length > 0" class="space-y-16">
      <MyWorkSections :projects="projectItems.slice(0, 3)" />
    </section>
    <p v-else>Loading projects...</p>
    <BackgroundBottomSVG />
    <FooterComponent />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TheJumbotron from '@/components/TheJumbotron.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import MyWorkSections from '@/components/MyWorkSections.vue';
import BackgroundBottomSVG from '../assets/svgs/BackgroundBottomSVG.vue';
import BackgroundTopSVG from '../assets/svgs/BackgroundTopSVG.vue';

// Create a ref for the project items
const projectItems = ref(null);
const isJumbotronLoaded = ref(false);

onMounted(async () => {
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
});

const handleJumbotronLoaded = () => {
  isJumbotronLoaded.value = true;
};
</script>

