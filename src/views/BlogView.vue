<template>
  <main>
    <TheJumbotron @loaded="handleJumbotronLoaded" />
    <BackgroundTopSVG />
    <ThePostsList id="blog-section" v-if="isJumbotronLoaded" />
    <button id="backToTop" title="Go to top" class="fixed z-50 hidden text-white transition-opacity bg-[#202733] rounded-full w-16 h-16 bottom-5 right-5 opacity-70 hover:opacity-100">
      <div class="flex flex-col items-center justify-center">
        <ArrowUpIcon class="w-6 h-6 mb-1 stroke-2 " />
        <span class="mb-1 text-sm font-semibold">Top</span>
      </div>
    </button>
    <BackgroundBottomSVG />
    <FooterComponent />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ThePostsList from '../components/ThePostsList.vue';
import TheJumbotron from '../components/TheJumbotron.vue';
import FooterComponent from '../components/FooterComponent.vue';
import BackgroundBottomSVG from '../assets/svgs/BackgroundBottomSVG.vue';
import BackgroundTopSVG from '../assets/svgs/BackgroundTopSVG.vue';
import { ArrowUpIcon } from '@heroicons/vue/24/outline'

const isJumbotronLoaded = ref(false);


// Handler for when the Jumbotron is loaded
const handleJumbotronLoaded = () => {
  isJumbotronLoaded.value = true;
};

// Start loading project items on mount
onMounted(() => {

  // Get the button element after the component is mounted
  let backToTopButton = document.getElementById("backToTop");

  // Show the button when user scrolls down 100 pixels from the top
  window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  };

  // Scroll to the top of the page when the button is clicked
  backToTopButton.onclick = function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scrolling
    });
  };
});
</script>