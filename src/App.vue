<script setup>
import TheNavBar from './components/TheNavBar.vue'
</script>

<template>
  <div>
    <header>
      <div class="wrapper">
        <TheNavBar/>
      </div>
    </header>
    <RouterView />
  </div>
</template>
