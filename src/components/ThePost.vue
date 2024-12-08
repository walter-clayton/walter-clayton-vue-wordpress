<template>
  <div>
    <div v-if="post" class="max-w-3xl px-5 mx-auto mt-24 text-center">
      <h1 
        v-html="post.title.rendered" 
        class="mb-4 text-2xl font-extrabold leading-tight sm:text-2xl lg:text-3xl lg:leading-snug"
      ></h1>
      <span 
        class="block mb-2 text-base text-gray-800 lg:text-xl lg:mb-4"
      >
        {{ formatDate(post.date) }}
      </span>
      <div class="relative">
        <img
          v-if="featuredImage"
          :src="featuredImage.url"
          :aria-label="featuredImage.description"
          :alt="featuredImage.alt"
          :title="featuredImage.title"
          class="object-cover w-auto h-auto mx-auto max-h-[300px] sm:max-h-[300px] lg:max-h-[400px] rounded-lg my-6 sm:my-8 lg:my-10 aspect-w-16 aspect-h-9 transition-transform duration-300 hover:scale-105"
          loading="lazy"
          @load="imageLoaded = true"
        />
        <div
          v-if="!imageLoaded"
          class="absolute inset-0 bg-gray-200 rounded-lg animate-pulse"
        ></div>
      </div>
      <figcaption class="hidden">
        {{ featuredImage.caption }}
      </figcaption>
      <div v-html="post.content.rendered" class="mb-6 text-lg text-left md:text-xl"></div>
      <p class="mt-4 italic text-right">Written by <em>{{ authorName }}</em></p>
      <!-- <div class="mt-4 text-left">
        <p v-if="tags.length || categories.length">
          <button
            @click="showTagsCategories = !showTagsCategories"
            class="px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-900"
          >
            {{ showTagsCategories ? 'Hide' : 'Show' }} Categories and Tags
          </button>
        </p>
        <div v-if="showTagsCategories" class="mt-4">
          <p v-if="categories.length" class="mb-2">
            <strong>Categories:</strong>
            <br />
            <span
              v-for="category in categories"
              :key="category.id"
              class="inline-block px-2 py-1 mt-1 mr-2 text-xs font-semibold text-white bg-gray-800 rounded"
            >
              {{ category.name }}
            </span>
          </p>
          <p v-if="tags.length">
            <strong>Tags:</strong>
            <br />
            <span
              v-for="tag in tags"
              :key="tag.id"
              class="inline-block px-2 py-1 mt-1 mr-2 text-xs font-semibold text-white bg-gray-500 rounded"
            >
              {{ tag.name }}
            </span>
          </p>
        </div>
      </div> -->
      <!-- <div class="mt-4">
        <a
          :href="twitterShareUrl"
          class="inline-block px-4 py-2 mr-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          target="_blank"
        >
          Share on Twitter
        </a>
        <a
          :href="facebookShareUrl"
          class="inline-block px-4 py-2 text-white bg-blue-800 rounded-md hover:bg-blue-900"
          target="_blank"
        >
          Share on Facebook
        </a>
      </div> -->
    </div>
    <p class="mt-10 text-center" v-else>Loading...</p>
    <button
      id="backToTop"
      title="Go to top"
      class="fixed z-50 hidden w-16 h-16 text-white transition-opacity bg-gray-800 rounded-full bottom-5 right-5 opacity-70 hover:opacity-100"
    >
      <div class="flex flex-col items-center justify-center">
        <ArrowUpIcon class="w-6 h-6 mb-1" />
        <span class="text-sm font-semibold">Top</span>
      </div>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ArrowUpIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const post = ref(null);
const authorName = ref('');
const categories = ref([]);
const tags = ref([]);
const showTagsCategories = ref(false);

// State to track image loading
const imageLoaded = ref(false);

// Simulated featured image data
const featuredImage = ref({
  url: "", // Replace with your image URL
  alt: "",
  title: "",
});

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


// Start loading project items on mount
onMounted(() => {
  const postId = route.params.id;
  fetchPost(postId);

  // Get the button element after the component is mounted
  let backToTopButton = document.getElementById("backToTop");

  // Show the button when user scrolls down 100 pixels from the top
  window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  };

  // Scroll to the top of the page when the button is clicked
  backToTopButton.onclick = function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scrolling
    });
  };
});
</script>

<style scoped>

/* Use :deep to target nested images */
:deep(.content code){
  display: block;
  background-color: #202733;
  color: #ffffff;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-x: auto;
  max-width: 100%;
}
:deep(.content img),
:deep(.content figure img),
:deep(.content figure figure img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
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
</style>
