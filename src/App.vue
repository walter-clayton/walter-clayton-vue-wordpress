<script setup>
import { RouterLink, RouterView } from 'vue-router'
import TheJumbotron from './components/TheJumbotron.vue'
import TheNavBar from './components/TheNavBar.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <TheNavBar/>
      <TheJumbotron />
    </div>
  </header>
  <RouterView />
</template>
