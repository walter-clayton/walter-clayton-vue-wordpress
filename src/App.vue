<script setup>
import { RouterLink, RouterView } from 'vue-router'
import TheNavBar from './components/TheNavBar.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <TheNavBar/>
    </div>
  </header>
  <RouterView />
</template>
