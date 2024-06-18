<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const posts = ref([]);
const maxExcerptLength = 150;

const fetchPosts = async () => {
  try {
    const response = await axios.get('https://blog.walterclayton.com/wp-json/wp/v2/posts/');
    const postsData = response.data;

    for (const post of postsData) {
      if (post.featured_media) {
        try {
          const mediaResponse = await axios.get(`https://blog.walterclayton.com/wp-json/wp/v2/media/${post.featured_media}`);
          post.featuredImage = mediaResponse.data.source_url;
        } catch (error) {
          console.error(`Error fetching media for post ID ${post.id}:`, error);
        }
      }
      post.excerpt.rendered = truncateExcerpt(post.excerpt.rendered);
    }

    posts.value = postsData;
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};

const truncateExcerpt = (excerpt) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = excerpt;
  const text = tempDiv.textContent || tempDiv.innerText || "";
  if (text.length > maxExcerptLength) {
    return text.substring(0, maxExcerptLength) + '...';
  }
  return text;
};

onMounted(fetchPosts);

const formatDate = (dateString) => {
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', options);
};
</script>

<template>
  <section v-if="posts.length > 0">
    <article v-for="post in posts" :key="post.id" class="main-article">
      <img v-if="post.featuredImage" :src="post.featuredImage" alt="Featured Image" class="featured-image"/>
      <h3 v-html="post.title.rendered" class="title"></h3>
      <span class="date">{{ formatDate(post.date) }}</span>
      <div v-html="post.excerpt.rendered" class="excerpt"></div>
      <div class="read-more" @click="trackReadMoreClick(post.id)">
        <router-link :to="{ name: 'post', params: { id: post.id } }">Read More</router-link>
      </div>
    </article>
  </section>
  <p class="no-post" v-else>No posts available.</p>
</template>

<style scoped lang="scss">
section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 95%;
  max-width: 1200px;
  margin: auto;
  padding: 20px 0;
}

@media screen and (max-width: 992px) {
  section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  section {
    grid-template-columns: 1fr;
  }
}

.main-article {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  background-color: white;
  border: 1px solid #ddd;
  box-sizing: border-box;
  border-radius: 25px; 

}

.no-post {
  text-align: center;
  margin-top: 20px;
}

@media screen and (max-width: 768px) {
  .main-article {
    margin-left: 15px;
    margin-right: 15px;
  }
}

.featured-image {
  width: 100%;
  height: 200px; /* Fixed height for images */
  object-fit: scale-down;
  margin-bottom: 15px;
}

.title {
  font-size: 24px;
  line-height: 1.5;
  margin: 0 0 10px 0;
  height: 110px;
  display: flex;
  align-items: center;
}

@media screen and (max-width: 768px) {
  .title {
    font-size: 20px;
  }
}

.date {
  color: rgba(12, 17, 43, 0.9);
  font-size: 0.9em;
  font-weight: 300;
  margin-bottom: 10px;
}

.excerpt {
  line-height: 1.5em;
  color: rgba(12, 17, 43, 0.8);
  flex-grow: 1;
  margin-bottom: 20px;
}

.read-more {
  background: #507A95;
  border-radius: 25px; 
  padding: 10px 20px;
  color: white;
  align-self: flex-start;
}
</style>
