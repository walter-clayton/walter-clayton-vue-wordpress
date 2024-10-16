<template>
  <div class="bg-[#D3C9BB] lg:min-h-screen flex items-center justify-center">
    <div class="max-w-7xl w-[90%] mx-auto flex flex-col md:flex-row justify-evenly flex-wrap py-5">
      <!-- SVG Component: Order changes based on screen size -->
      <div class="block-1 p-5 w-full md:w-[40%] flex justify-center order-1 md:order-2">
        <component :is="svgComponent" />
      </div>

      <!-- Content Section with Title, Subtitle, and CTA Buttons -->
      <div class="block-2 p-5 w-full md:w-[60%] text-center md:text-left flex flex-col self-center order-2 md:order-1">
        <!-- Title -->
        <h1 v-if="title" class="text-4xl font-bold md:text-6xl">
          <span v-for="(part, index) in title" :key="index">
            <span 
              v-if="index > 0" 
              class="px-2 py-1 text-2xl md:text-4xl italic bg-[#F3F0EB] text-[#202733] rounded-md" 
              :style="index > 0 ? 'display: inline-block; transform: skewX(-10deg);' : ''"
            >
              {{ part }}
            </span>
            <span v-else class="line-height-extra">
              {{ part }}
            </span>
            <br v-if="index !== title.length - 1">
          </span>
        </h1>

        <!-- Subtitle -->
        <h2 v-if="subtitle" class="mt-4 text-2xl font-bold md:text-3xl">{{ subtitle }}</h2>

        <!-- CTA Buttons -->
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

    <!-- Coming Soon Modal -->
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
const description = ref(''); // Keeping this for SEO, but not rendering it
const buttons = ref([]);
const svgComponent = shallowRef(null);
const showModal = ref(false);

const updateContent = async () => {
  title.value = route.meta.title || 'Default Title';
  subtitle.value = route.meta.subtitle || 'Default Subtitle';
  description.value = route.meta.description || '';
  buttons.value = route.meta.buttons || [];

  loadSVG(); // Load the SVG component dynamically
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
  if (button.link === "#ComingSoon") {
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
.line-height-extra {
  line-height: 1.3 !important;
}

/* CTA Button Hover Effects */
a:hover {
  transition: all 0.3s ease-in-out;
}

/* Title Custom Styles */
h1 {
  margin-bottom: 1rem;
}

h2 {
  margin-bottom: 1.5rem;
}
</style>
