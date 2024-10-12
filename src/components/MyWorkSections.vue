<!-- MyWorkSections.vue  -->
<template>
  <BaseSection
    title="MY WORK"
    subtitle="This section highlights both my personal initiatives and professional projects."
    buttonText="Go to All Projects"
    @button-click="goToProjects"
    id="my-work"
  >
    <template v-slot:header>
        <Line/>
        <Lamp/>
        <Line/>
    </template>
    <template v-slot:content>
            <CardComponent v-if="projects.length > 0" :projects="projects" class="flex flex-col gap-8 lg:flex-row"/>
            <p v-else>No projects available</p>
    </template>
    <template v-slot:footer-left>
        <div class="hidden lg:block">
            <BraceLeft />
        </div>
    </template>
    <template v-slot:footer-right>
        <div class="hidden lg:block">
            <BraceRight />
        </div>
    </template>
</BaseSection>
</template>

<script setup>
import { defineProps } from 'vue';
import BaseSection from './BaseSection.vue';
import CardComponent from './CardComponent.vue';
import Lamp from '../assets/svgs/LampSVG.vue';
import Line from '../assets/svgs/LineSVG.vue';
import BraceLeft from '../assets/svgs/BraceLeftSVG.vue';
import BraceRight from '../assets/svgs/BraceRightSVG.vue';

defineProps({
  projects: {
    type: Array,
    required: true,
    default: () => []
  }
});

</script>