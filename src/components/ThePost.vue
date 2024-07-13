<template>
  <div v-if="post" class="post-container">
    <h1 v-html="post.title.rendered" class="title"></h1>
    <span class="date">{{ formatDate(post.date) }}</span>
    <img v-if="featuredImage" :src="featuredImage.url" :alt="featuredImage.alt" :title="featuredImage.title" class="featured-image" loading="lazy"/>
    <div v-html="post.content.rendered" class="content"></div>
    <p class="author">Written by <em>{{ authorName }}</em></p>
    <div class="tags-categories">
      <p v-if="tags.length || categories.length">
        <button @click="showTagsCategories = !showTagsCategories">
          {{ showTagsCategories ? 'Hide' : 'Show' }} Categories and Tags 
        </button>
      </p>
      <div v-if="showTagsCategories">
        <p v-if="categories.length">
          <strong>
            Categories:
          </strong>
          <br />
          <span v-for="category in categories" :key="category.id" class="badge badge-primary">
            {{ category.name }}
          </span>
        </p>
        <p v-if="tags.length">
          <strong>
            Tags:
          </strong>
          <br />
          <span v-for="tag in tags" :key="tag.id" class="badge badge-secondary">
            {{ tag.name }}
          </span>
        </p>
    </div>
    </div>
    <div class="social-share">
      <a :href="twitterShareUrl" class="btn-secondary" target="_blank">Share on Twitter</a>
      <a :href="facebookShareUrl" class="btn-secondary" target="_blank">Share on Facebook</a>
    </div>
  </div>
  <p class="loading" v-else>Loading...</p>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const post = ref(null);
const authorName = ref('');
const featuredImage = ref('');
const categories = ref([]);
const tags = ref([]);
const showTagsCategories = ref(false);

const fetchPost = async (id) => {
  try {
    const response = await axios.get(`https://blog.walterclayton.com/wp-json/wp/v2/posts/${id}`);
    post.value = response.data;

    if (post.value.featured_media) {
      try {
        const mediaResponse = await axios.get(`https://blog.walterclayton.com/wp-json/wp/v2/media/${post.value.featured_media}`);
        featuredImage.value = {
          url: mediaResponse.data.source_url,
          alt: mediaResponse.data.alt_text,
          title: mediaResponse.data.title.rendered,
          description: mediaResponse.data.description.rendered,
          caption: mediaResponse.data.caption.rendered
        };
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

    if (post.value.categories.length) {
      try {
        const categoryResponses = await Promise.all(
          post.value.categories.map(catId => axios.get(`https://blog.walterclayton.com/wp-json/wp/v2/categories/${catId}`))
        );
        categories.value = categoryResponses.map(res => res.data);
      } catch (error) {
        console.error(`Error fetching categories for post ID ${post.value.id}:`, error);
      }
    }

    if (post.value.tags.length) {
      try {
        const tagResponses = await Promise.all(
          post.value.tags.map(tagId => axios.get(`https://blog.walterclayton.com/wp-json/wp/v2/tags/${tagId}`))
        );
        tags.value = tagResponses.map(res => res.data);
      } catch (error) {
        console.error(`Error fetching tags for post ID ${post.value.id}:`, error);
      }
    }

    insertMetaTags();
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

const structuredData = computed(() => {
  if (!post.value) return null;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.value.title.rendered,
    "image": featuredImage.value,
    "author": {
      "@type": "Person",
      "name": authorName.value
    },
    "datePublished": post.value.date,
    "articleBody": post.value.content.rendered.replace(/(<([^>]+)>)/gi, ''),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://yourwebsite.com/${post.value.slug}`
    },
    "keywords": tags.value.map(tag => tag.name).join(', '),
    "articleSection": categories.value.map(category => category.name).join(', ')
  });
});

const insertMetaTags = () => {
  if (!post.value) return;
  
  const head = document.head;

  const metaDescription = document.createElement('meta');
  metaDescription.name = 'description';
  metaDescription.content = post.value.excerpt.rendered.replace(/(<([^>]+)>)/gi, '');
  head.appendChild(metaDescription);

  const ogTitle = document.createElement('meta');
  ogTitle.setAttribute('property', 'og:title');
  ogTitle.content = post.value.title.rendered;
  head.appendChild(ogTitle);

  const ogDescription = document.createElement('meta');
  ogDescription.setAttribute('property', 'og:description');
  ogDescription.content = post.value.excerpt.rendered.replace(/(<([^>]+)>)/gi, '');
  head.appendChild(ogDescription);

  const ogImage = document.createElement('meta');
  ogImage.setAttribute('property', 'og:image');
  ogImage.content = featuredImage.value.url;
  head.appendChild(ogImage);

  const ogUrl = document.createElement('meta');
  ogUrl.setAttribute('property', 'og:url');
  ogUrl.content = `https://yourwebsite.com/${post.value.slug}`;
  head.appendChild(ogUrl);

  const keywordsMeta = document.createElement('meta');
  keywordsMeta.name = 'keywords';
  keywordsMeta.content = tags.value.map(tag => tag.name).join(', ');
  head.appendChild(keywordsMeta);

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = structuredData.value;
  head.appendChild(script);
};

const twitterShareUrl = computed(() => {
  if (!post.value) return '';
  return `https://twitter.com/intent/tweet?url=https://yourwebsite.com/${post.value.slug}&text=${encodeURIComponent(post.value.title.rendered)}`;
});

const facebookShareUrl = computed(() => {
  if (!post.value) return '';
  return `https://www.facebook.com/sharer/sharer.php?u=https://yourwebsite.com/${post.value.slug}`;
});

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

:deep(.parent-link) {
  margin-bottom: 40px !important;
}
:deep(.link) {
  background: #507A95;
  border-radius: 25px; 
  padding: 10px 20px;
  color: white;
  align-self: flex-start;
}

.social-share {
  margin-top: 20px;
}

.btn-secondary {
  display: inline-block;
  padding: 10px 20px;
  margin: 5px;
  font-size: 1em;
  text-decoration: none;
  border-radius: 15px;
}

.btn-secondary {
  background-color: #ffffff;
  color: #47758c;
  border: 2px solid #202733;
}

.btn-secondary:hover{
    background-color: #202733;
    color: #ffffff;
    border: 2px solid #202733;
}

.badge {
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
  margin-right: 0.5em;
}

.badge-secondary {
  color: #fff;
  background-color: #6c757d;
}

.badge-primary {
  color: #fff;
  background-color: #202733;
}

</style>
