<template>
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-md p-8 text-center bg-white rounded-md shadow-lg">
      <WrenchScrewdriverIcon class="mx-auto mb-4 size-12" />
      <h2 class="mb-4 text-2xl font-bold">Coming Soon!</h2>
      <p>The feature is currently under construction.
        <br> Follow my progress on
        <a href="https://github.com/walter-clayton" class="underline">
          Github
        </a>!
      </p>
      <button @click="closeModal" class="px-5 py-2 mt-5 text-white rounded-md btn-primary">Close</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { WrenchScrewdriverIcon } from '@heroicons/vue/24/solid';

defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>