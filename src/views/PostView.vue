<!-- ParentComponent.vue -->
<template>
  <ThePost :route="route" />
</template>

<script setup>

import { useRoute } from 'vue-router';
const route = useRoute();
</script>