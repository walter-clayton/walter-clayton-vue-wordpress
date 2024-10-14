
<!-- BaseSection.vue  -->
<template>
  <section :class="sectionClasses">
    <header v-if="title || subtitle" class="my-12 text-center">
      <h2 v-if="title" class="my-12 text-3xl font-bold md:text-5xl">{{ title }}</h2>
      <div class="flex flex-row items-center justify-center my-12">
        <slot name=header></slot>
      </div>
      <p v-if="subtitle" class="my-12 text-lg">{{ subtitle }}</p>
    </header>
    <div class="flex flex-col items-center my-12">
            <slot name=content></slot>
    </div>
    <footer v-if="buttonText" class="flex justify-center text-center mt-18">
      <div class="flex flex-row items-center justify-center">
        <slot name=footer-left></slot>
        <button 
            @click="handleButtonClick" 
            class="flex items-center px-5 px-6 py-2 m-2 text-white transition duration-300 rounded-full group align-center btn-primary hover:bg-gray-700 text-avenir">
            
            {{ buttonText }}

            <span class="inline-block ml-2">
            <ArrowRightIcon class="w-6 h-6 transition-transform duration-300 stroke-2 group-hover:translate-x-2" />
            </span>
        </button>
        <slot name=footer-right></slot>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';

defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: ''
  },
  sectionClasses: {
    type: String,
    default: 'container mx-auto my-12 px-4'
  }
});

const emit = defineEmits(['button-click']);

const handleButtonClick = () => {
  emit('button-click');
};
</script>