<script setup>
import { useRoute } from 'vue-router'
import {ref, onBeforeMount } from 'vue'
import axios from 'axios'

const route = useRoute()
const posts = ref([]);

const fetchPosts = async () => {
  try {
    const response = await axios.get(`https://lightgrey-dragonfly-134918.hostingersite.com/?rest_route=/wp/v2/posts/`);
    posts.value = posts.value.concat(response.data);
    console.log(response)
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
onBeforeMount(async () => {
  await fetchPosts(posts.value);
});
const formatDate = (dateString) => {
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', options);
};
const createPostLinks = (post) => {
  return `/post?p=${post.id}`;
};
console.log(createPostLinks)
console.log(route)
</script>
<template>
  <section>
      <article class="main-article" v-for="post in posts" :key="post.id">
          <h3 class="title">{{ post.title.rendered }}</h3>
          <span class="date">{{ formatDate(post.date) }}</span>
          <div class="excerpt" v-html="post.excerpt.rendered"></div>
          <div class="read-more">
          <router-link :to="{ name: 'post', params: { id: post.id } }">Read More</router-link>
          </div>
      </article>
  </section>
</template>
<style scoped lang="scss">
section{
  width: 95%;
  max-width: 1200px;
  margin: auto;
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
}
@media screen and (max-width: 992px) {
  section {
    width: 100%;
    flex-direction: column;
    margin: auto;  }
}
.main-article {
  display: flex;
  flex-direction: column;
  width: 500px;
  padding: 25px;
  border-radius: 25px;
  margin: 25px;
  background-color: white;
  color: black;
  // opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  &.active {
    opacity: 1;
    transform: translateY(0);
  }
}
@media screen and (max-width: 1300px) {
  .main-article {
    width: 400px;
  }
}
@media screen and (max-width: 1112px) {
  .main-article {
    width: 350px;
  }
}
@media screen and (max-width: 1002px) {
  .main-article {
    width: auto;
  }
}
.title {
  font-size: 24px;
  line-height: 1.5;
  box-sizing: border-box;
  margin: 0px 0px 10px 0px;
}
.date{
  color: rgba(12, 17, 43, 0.9);
  font-size: 0.9em;
  font-weight: 300;
}
.excerpt {
  line-height: 1.5em;
  color: rgba(12, 17, 43, 0.8);
}
.read-more{
  color: #507A95;
  align-self: flex-start;
}
@media screen and (max-width: 768px) {
    .container {
      width: 100%;
      flex-direction: column;
      margin: auto;
    }
}
</style>