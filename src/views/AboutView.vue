<template>
  <section>
    <TheJumbotron @loaded="handleJumbotronLoaded" />
    <BackgroundTopSVG />
    <div id="story-section" v-if="isJumbotronLoaded" class="post-container">
      <h1 v-html="aboutItem.title" class="title"></h1>
      <img v-if="aboutItem.featuredImage" :src="aboutItem.featuredImage" alt="Featured Image" class="featured-image" ref="featuredImageRef" />
      <div class="content">
        <p class="mb-6 text-lg md:text-xl" v-for="(paragraph, index) in aboutItem.content.paragraphs" :key="index" v-html="paragraph"></p>
      </div>
    </div>
    <p class="loading" v-else>Loading...</p>
    <BackgroundBottomSVG />
    <FooterComponent />
  </section>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import FooterComponent from '../components/FooterComponent.vue';
import aboutData from '@/assets/about.json';
import TheJumbotron from '../components/TheJumbotron.vue';
import BackgroundBottomSVG from '../assets/svgs/BackgroundBottomSVG.vue';
import BackgroundTopSVG from '../assets/svgs/BackgroundTopSVG.vue';

const aboutItem = ref({ ...aboutData });
const isJumbotronLoaded = ref(false);
const featuredImageRef = ref(null);

const resolveImagePath = (path) => {
  return new URL(`../assets/${path.split('/').pop()}`, import.meta.url).href;
};

if (aboutItem.value.featuredImage) {
  aboutItem.value.featuredImage = resolveImagePath(aboutItem.value.featuredImage);
}

const handleJumbotronLoaded = () => {
  isJumbotronLoaded.value = true;
};

onMounted(() => {
  // Intersection Observer will be set up in the watch function
});

watch(isJumbotronLoaded, async (newValue) => {
  if (newValue) {
    await nextTick();  // Wait for the DOM to update
    if (featuredImageRef.value) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const ratio = entry.intersectionRatio;
          entry.target.style.opacity = ratio;
          entry.target.style.transform = `translateY(${20 * (1 - ratio)}px)`;
        });
      }, {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100)  // Set thresholds at every percentage from 0 to 1
      });

      observer.observe(featuredImageRef.value);
    }
  }
});
</script>

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
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
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

.featured-image {
  width: 100%;
  margin: 20px 0;
  object-fit: scale-down;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.featured-image.is-visible {
  opacity: 1;
  transform: translateY(0);
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
