<template>
  <div v-if="post" class="post-container">
    <h1 v-html="post.title.rendered" class="title"></h1>
    <span class="date">{{ formatDate(post.date) }}</span>
    <img v-if="featuredImage" :src="featuredImage" alt="Featured Image" class="featured-image"/>
    <div v-html="post.content.rendered" class="content"></div>
    <p class="author">Written by <em>{{ authorName }}</em></p>
  </div>
  <p class="loading" v-else>Loading...</p>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const post = ref(null);
const authorName = ref('');
const featuredImage = ref('');

const fetchPost = async (id) => {
  try {
    const response = await axios.get(`https://blog.walterclayton.com/wp-json/wp/v2/posts/${id}`);
    post.value = response.data;

    if (post.value.featured_media) {
      try {
        const mediaResponse = await axios.get(`https://blog.walterclayton.com/wp-json/wp/v2/media/${post.value.featured_media}`);
        featuredImage.value = mediaResponse.data.source_url;
      } catch (error) {
        console.error(`Error fetching media for post ID ${post.value.id}:`, error);
      }
    }

    if (post.value.author) {
      try {
        const authorResponse = await axios.get(`https://blog.walterclayton.com/wp-json/wp/v2/users/${post.value.author}`);
        authorName.value = authorResponse.data.name;
      } catch (error) {
        console.error(`Error fetching author for post ID ${post.value.id}:`, error);
      }
    }
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
  }
};

const formatDate = (dateString) => {
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', options);
};

onMounted(() => {
  const postId = route.params.id;
  fetchPost(postId);
});
</script>

<style scoped>
.post-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.featured-image {
  width: 100%;
  margin: 20px 0;
  object-fit: scale-down;
}

.loading {
  text-align: center;
  margin-top: 20px;
}

/* For mobile view */
.featured-image {
  height: auto;
}

/* For tablet and desktop views */
@media screen and (min-width: 768px) {
  .featured-image {
    height: 500px;
  }
}

.title {
  font-size: 24px;
  line-height: 1.5;
  margin: 20px 0 10px 0;
}

.date {
  color: rgba(12, 17, 43, 0.9);
  font-size: 1em;
  font-weight: 300;
  margin-bottom: 20px;
}

.content {
  margin-bottom: 20px;
  text-align: left;
}

/* Use :deep to target nested images */
:deep(.content img),
:deep(.content figure img),
:deep(.content figure figure img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.author {
  text-align: right;
  font-style: italic;
  margin-top: 20px;
}
</style>
