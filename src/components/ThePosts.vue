<script setup>
import {ref, onBeforeMount } from 'vue'
import axios from 'axios'

const posts = ref([]);
const currentPage = ref(1);

const fetchPosts = async (page) => {
  try {
    const response = await axios.get(`https://walter-clayton.000webhostapp.com/wp-json/wp/v2/posts?per_page=10&page=${page}`);
    posts.value = posts.value.concat(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

onBeforeMount(async () => {
  await fetchPosts(currentPage.value);
});
</script>
<template>
  <div>
    <h1>This is a test page</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <h2>{{ post.title.rendered }}</h2>
        <div v-html="post.content.rendered"></div>
      </li>
    </ul>
  </div>
</template>
