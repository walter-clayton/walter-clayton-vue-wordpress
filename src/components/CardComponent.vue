<template>
  <div>
    <article v-for="project in projects" :key="project.id" class="flex flex-col items-center justify-around max-w-sm p-6 text-center transition transform translate-y-5 bg-white rounded-lg shadow-md opacity-0 hover:shadow-lg main-article"> 
      <div class="flex flex-row items-center gap-3">
        <img :src="project.featureImage" :alt="`Image for ${project.title}`" class="object-cover w-full mb-4 rounded-lg h-52 featured-image" />
        <h3 class="mb-2 text-xl font-semibold">{{ project.title }}</h3>
      </div>
      <p class="my-4 text-sm">{{ project.description }}</p>
      <div class="flex flex-row justify-around w-full mt-4 text-sm">
        <a :href="project.website_link" class="flex items-center justify-center p-1 transition bg-[#F3F0EB] rounded-full font-avenir hover:bg-[#202733] hover:text-white" target="_blank" rel="noopener noreferrer">
          <span>
            <ArrowRightStartOnRectangleIcon class="w-6 h-4" />
          </span>
          <span class="p-1">
          {{ project.website }}
          </span> 
        </a>
        <a :href="project.post_link" 
          class="flex items-center p-1 transition rounded-full group font-avenir" 
          target="_blank" rel="noopener noreferrer"
          @click.prevent="handleButtonClick(project.post_link)">
          Learn More
          <span class="inline-block ml-2">
            <ArrowRightIcon class="w-6 h-4 transition-transform duration-300 group-hover:translate-x-2" />
          </span>
        </a>
      </div>
    </article>

    <!-- Modal Section -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-full max-w-md p-8 text-center bg-white rounded-md shadow-lg">
        <h2 class="mb-4 text-2xl font-bold">Coming Soon!</h2>
          <p>The feature is currently under construction. 
            <br> Follow my progress on 
              <a href="https://github.com/walter-clayton" class="underline">
              Github
              </a>!
          </p>
        <button @click="closeModal" class="px-5 py-2 mt-5 text-white rounded-md btn-primary avenir next">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, defineProps } from 'vue';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/outline';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';

defineProps({
  projects: {
    type: Array,
    required: true,
    default: () => []
  }
});

const showModal = ref(false);

const handleButtonClick = (link) => {
  if (link === '#') {
    showModal.value = true;
  } else if (link) {
    window.location.href = link;
  }
};

const closeModal = () => {
  showModal.value = false;
};

onMounted(async () => {
  await nextTick();  // Wait for the DOM to update

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const ratio = entry.intersectionRatio;
      entry.target.style.opacity = ratio;
      entry.target.style.transform = `translateY(${20 * (1 - ratio)}px)`;
    });
  }, {
    threshold: Array.from({ length: 101 }, (_, i) => i / 100)  // Set thresholds at every percentage from 0 to 1
  });

  const articles = document.querySelectorAll('.main-article');
  articles.forEach(article => observer.observe(article));
});
</script>

<style scoped lang="scss">

.featured-image {
  width: 100%;
  height: 50px; /* Fixed height for images */
  object-fit: scale-down;
  margin-bottom: 15px;
}

.title {
  font-size: 24px;
  line-height: 1.5;
  margin: 0 0 10px 0;
  height: 110px;
  display: flex;
  align-items: center;
}

@media screen and (max-width: 768px) {
  .title {
    font-size: 20px;
  }
}

.description {
  line-height: 1.5em;
  color: rgba(12, 17, 43, 0.8);
  flex-grow: 1;
  margin-bottom: 20px;
}

.link {
  background: #507A95;
  border-radius: 25px;
  padding: 10px 20px;
  color: white;
  align-self: flex-start;
}

section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 95%;
  max-width: 1200px;
  margin: auto;
  padding: 20px 0;
}

@media screen and (max-width: 992px) {
  section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  section {
    grid-template-columns: 1fr;
  }
}
</style>