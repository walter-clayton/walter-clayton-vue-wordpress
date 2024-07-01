<script setup>
import { ref } from 'vue';
import ThePostsList from '../components/ThePostsList.vue';
import TheJumbotron from '../components/TheJumbotron.vue';
import FooterComponent from '../components/FooterComponent.vue';
import BackgroundBottomSVG from '../assets/svgs/BackgroundBottomSVG.vue';
import BackgroundTopSVG from '../assets/svgs/BackgroundTopSVG.vue';

const isJumbotronLoaded = ref(false);

// Handler for when the Jumbotron is loaded
const handleJumbotronLoaded = () => {
  isJumbotronLoaded.value = true;
};

</script>
<template>
    <main>
        <TheJumbotron @loaded="handleJumbotronLoaded"/>
        <BackgroundTopSVG />
        <ThePostsList  v-if="isJumbotronLoaded"/>
        <BackgroundBottomSVG />
        <FooterComponent />
    </main>
</template>
