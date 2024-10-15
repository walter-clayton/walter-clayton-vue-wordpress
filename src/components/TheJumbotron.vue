<template>
  <div class="bg-[#D3C9BB] min-h-screen flex items-center justify-center">
    <div class="max-w-7xl w-[90%] mx-auto flex flex-col md:flex-row justify-evenly flex-wrap py-5">
      <!-- SVG Component: Order changes based on screen size -->
      <div class="block-1 p-5 w-full md:w-[40%] flex justify-center order-1 md:order-2">
        <component :is="svgComponent" />
      </div>

      <!-- Content Section with Fade-In Animation -->
      <div
        class="block-2 p-5 w-full md:w-[60%] text-center md:text-left flex flex-col self-center order-2 md:order-1 slide-in"
        v-if="svgComponent"
      >
        <h1 v-if="title" class="text-4xl font-bold md:text-6xl">{{ title }}</h1>
        <h2 v-if="subtitle" class="mt-4 text-xl font-bold md:text-2xl">{{ subtitle }}</h2>
        <p v-if="description" class="mt-4 text-base md:text-lg">{{ description }}</p>
        <div v-if="buttons" class="flex flex-wrap justify-center mt-5 md:justify-start">
          <a
            v-for="button in buttons"
            :key="button.text"
            :href="button.link"
            @click.prevent="handleButtonClick(button)"
            :class="[
              button.class,
              'transition-colors duration-200',
              button.class === 'btn-secondary'
                ? 'hover:bg-[#202733] hover:text-white'
                : 'hover:bg-transparent hover:text-[#202733] hover:border-[#202733]',
              'hover:shadow-lg hover:-translate-y-1',
            ]"
          >
            {{ button.text }}
          </a>
        </div>
      </div>
    </div>
    <ComingSoonModal v-if="showModal" :showModal="showModal" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, shallowRef, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import ComingSoonModal from './ComingSoonModal.vue';

const route = useRoute();
const emit = defineEmits(['loaded']);

const title = ref('');
const subtitle = ref('');
const description = ref('');
const buttons = ref([]);
const svgComponent = shallowRef(null);
const showModal = ref(false);

const updateContent = async () => {
  title.value = route.meta.title || 'Default Title';
  subtitle.value = route.meta.subtitle || 'Default Subtitle';
  description.value = route.meta.description || '';
  buttons.value = route.meta.buttons || [];
  
  loadSVG();  // Load the SVG without waiting for it to be completely ready
};

const loadSVG = async () => {
  const svgComponentName = route.meta.svg || 'DefaultSVG';
  try {
    svgComponent.value = (await import(`@/assets/svgs/${svgComponentName}.vue`)).default;
  } catch (error) {
    console.error('Error loading SVG component:', error);
  }
};

watch(route, updateContent);

onMounted(() => {
  updateContent();
  emit('loaded');
});

const handleButtonClick = (button) => {
  if (button.text === "Get a Quote") {
    showModal.value = true;
  } else if (button.link) {
    window.location.href = button.link;
  }
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
/* Slide-in animation */
.slide-in {
  opacity: 0;
  transform: translateX(-100%);
  animation: slideInEffect 1s ease-out forwards;
}

@keyframes slideInEffect {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
