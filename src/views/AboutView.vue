<script setup>
import { ref } from 'vue';
import FooterComponent from '../components/FooterComponent.vue';
import aboutData from '@/assets/about.json';
import TheJumbotron from '../components/TheJumbotron.vue';
import BackgroundBottomSVG from '../assets/svgs/BackgroundBottomSVG.vue';
import BackgroundTopSVG from '../assets/svgs/BackgroundTopSVG.vue';

// Create a ref for the aboutItem
const aboutItem = ref({ ...aboutData });
const isJumbotronLoaded = ref(false);

// Function to resolve image paths dynamically
const resolveImagePath = (path) => {
  return new URL(`../assets/${path.split('/').pop()}`, import.meta.url).href;
};

// Update the featuredImage path
if (aboutItem.value.featuredImage) {
  aboutItem.value.featuredImage = resolveImagePath(aboutItem.value.featuredImage);
}

// Handler for when the Jumbotron is loaded
const handleJumbotronLoaded = () => {
  isJumbotronLoaded.value = true;
};
</script>

<template>
  <section>
    <TheJumbotron @loaded="handleJumbotronLoaded" />
    <BackgroundTopSVG />
    <div v-if="isJumbotronLoaded" class="post-container">
      <h1 v-html="aboutItem.title" class="title"></h1>
      <img v-if="aboutItem.featuredImage" :src="aboutItem.featuredImage" alt="Featured Image" class="featured-image" />
      <div class="content">
        <p v-for="(paragraph, index) in aboutItem.content.paragraphs" :key="index" v-html="paragraph"></p>
      </div>
    </div>
    <p class="loading" v-else>Loading...</p>
    <BackgroundBottomSVG />
    <FooterComponent />
  </section>
</template>

<style scoped>
.post-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.featured-image {
  width: 100%;
  margin: 20px 0;
  object-fit: scale-down;
}

.loading {
  text-align: center;
  margin-top: 20px;
}

/* For mobile view */
.featured-image {
  height: auto;
}

/* For tablet and desktop views */
@media screen and (min-width: 768px) {
  .featured-image {
    height: 500px;
  }
}

.title {
  font-size: 24px;
  line-height: 1.5;
  margin: 20px 0 10px 0;
}

.content {
  margin-bottom: 20px;
  text-align: left;
}

/* Use :deep to target nested images */
:deep(.content img),
:deep(.content figure img),
:deep(.content figure figure img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.author {
  text-align: right;
  font-style: italic;
  margin-top: 20px;
}

:deep(.parent-link) {
  margin-bottom: 40px !important;
}
:deep(.link) {
  background: #507A95;
  border-radius: 25px; 
  padding: 10px 20px;
  color: white;
  align-self: flex-start;
}
</style>
