<template>
  <div class="bg-[#D3C9BB]">
    <div class="max-w-7xl w-[90%] mx-auto flex flex-col md:flex-row justify-evenly flex-wrap py-5">
      <!-- SVG Component: Order changes based on screen size -->
      <div class="block-1 p-5 w-full md:w-[40%] flex justify-center order-1 md:order-2">
        <component :is="svgComponent" @load="handleLoad" />
      </div>

      <!-- Content Section -->
      <div class="block-2 p-5 w-full md:w-[60%] text-center md:text-left flex flex-col self-center order-2 md:order-1">
        <h1 v-if="title" class="text-4xl font-bold md:text-5xl">{{ title }}</h1>
        <h2 v-if="subtitle" class="mt-4 text-xl font-bold md:text-2xl">{{ subtitle }}</h2>
        <p v-if="description" class="mt-4 text-base md:text-lg">{{ description }}</p>
        <div v-if="buttons" class="flex flex-wrap justify-center mt-5 md:justify-start">
          <a
            v-for="button in buttons"
            :key="button.text"
            :href="button.link"
            :class="[
              button.class, // Add the dynamic button class
              'transition-colors duration-200', // Shared transition properties
              button.class === 'btn-secondary' 
                ? 'hover:bg-[#202733] hover:text-white' // Transition for btn-secondary
                : 'hover:bg-transparent hover:text-[#202733] hover:border-[#202733]', // Default transition for other buttons
              'hover:shadow-lg hover:-translate-y-1', // Lifting effect on hover
            ]"
          >
            {{ button.text }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheJumbotron',
  data() {
    return {
      title: 'WALTER CLAYTON',
      subtitle: 'Default Subtitle',
      description: '',
      buttons: [],
      svgComponent: null,
    };
  },
  watch: {
    '$route'(to) {
      this.updateContent();
    },
    svgComponent(newVal, oldVal) {
      if (newVal) {
        this.$emit('loaded');
      }
    },
  },
  created() {
    this.updateContent();
  },
  methods: {
    updateContent() {
      this.title = this.$route.meta.title || 'Default Title';
      this.subtitle = this.$route.meta.subtitle || 'Default Subtitle';
      this.description = this.$route.meta.description || '';
      this.buttons = this.$route.meta.buttons || [];
      this.loadSVG();
    },
    async loadSVG() {
      const svgComponentName = this.$route.meta.svg || 'DefaultSVG';
      try {
        this.svgComponent = (await import(`@/assets/svgs/${svgComponentName}.vue`)).default;
      } catch (error) {
        console.error('Error loading SVG component:', error);
      }
    },
  },
};
</script>

<style scoped>
@keyframes horizontalScroll {
  0% {
    transform: translate3d(0, 8%, 0);
  }
  100% {
    transform: translate3d(0, -2%, 0);
  }
}

@keyframes halfOpactiy {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.5;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.appear-one {
  animation: halfOpactiy 1s 1 forwards;
  opacity: 0;
}

.appear-two {
  animation: halfOpactiy 1s 0.5s 1 forwards;
  opacity: 0;
}

.appear-three {
  animation: halfOpactiy 1s 1s 1 forwards;
  opacity: 0;
}

.appear-four {
  animation: halfOpactiy 1s 1.5s 1 forwards;
  opacity: 0;
}

.appear-five {
  animation: halfOpactiy 1s 2s 1 forwards;
  opacity: 0;
}
</style>