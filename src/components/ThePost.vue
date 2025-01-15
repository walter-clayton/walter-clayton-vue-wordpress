<template>
  <div>
    <div v-if="post" class="px-5 mx-auto mt-24 max-w-3xl text-center">
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
        <!-- Debug info -->
        <div v-if="!featuredImage.url" class="text-red-500">No image URL available</div>
        
        <img
          v-if="featuredImage.url"
          :src="featuredImage.url"
          :alt="featuredImage.alt"
          class="object-cover w-auto h-auto mx-auto max-h-[300px] sm:max-h-[300px] lg:max-h-[400px] rounded-lg my-6 sm:my-8 lg:my-10"
          loading="lazy"
          @load="imageLoaded = true"
          @error="(e) => console.error('Image failed to load:', e)"
        />
      </div>
      <div v-html="post.content.rendered" class="mb-6 text-lg text-left md:text-xl blog-content"></div>
      <p class="mt-4 italic text-right">Written by <em>{{ authorName }}</em></p>
    </div>

    <!-- Comments Section -->
    <div v-if="post" class="px-5 mx-auto mt-12 max-w-3xl">
      <h2 class="mb-6 text-2xl font-bold">Comments</h2>
      
      <!-- Comments List -->
      <div v-if="comments.length" class="mb-8 space-y-6">
        <CommentThread
          v-for="comment in threadedComments"
          :key="comment.id"
          :comment="comment"
          :replying-to="replyingTo"
          :comment-success="commentSuccess"
          :comment-error="commentError"
          :new-comment="newComment"
          :captcha="captcha"
          :honeypot="honeypot"
          :is-submitting="isSubmitting"
          @reply="startReply"
          @cancel-reply="cancelReply"
          @submit="submitComment"
          @update:honeypot="honeypot = $event"
          @like="handleCommentLike"
        />
      </div>
      <p v-else class="mb-8 text-gray-500">No comments yet. Be the first to comment!</p>

      <!-- Main comment form (when not replying) -->
      <div v-if="!replyingTo" class="p-6 bg-white rounded-lg shadow-sm" id="main-comment-form">
        <h3 class="mb-4 text-xl font-semibold">Leave a Comment</h3>
        
        <CommentForm 
          :comment-success="commentSuccess"
          :comment-error="commentError"
          :new-comment="newComment"
          :captcha="captcha"
          :honeypot="honeypot"
          :is-submitting="isSubmitting"
          @update:honeypot="honeypot = $event"
          @submit="submitComment"
        />
        </div>
    </div>
    <p class="mt-10 text-center" v-else>Loading...</p>

    <!-- Back to Top Button -->
    <button
      id="backToTop"
      title="Go to top"
      class="hidden fixed right-5 bottom-5 z-50 w-16 h-16 text-white bg-gray-800 rounded-full opacity-70 transition-opacity hover:opacity-100"
    >
      <div class="flex flex-col justify-center items-center">
        <ArrowUpIcon class="mb-1 w-6 h-6" />
        <span class="text-sm font-semibold">Top</span>
      </div>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { ArrowUpIcon } from '@heroicons/vue/24/outline';
import { useRoute } from 'vue-router';
import axios from 'axios';
import CommentThread from '@/components/CommentThread.vue';
import CommentForm from '@/components/CommentForm.vue';

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

const comments = ref([]);
const newComment = reactive({
  author: '',
  content: '',
  email: ''
});
const isSubmitting = ref(false);
const commentError = ref('');
const commentSuccess = ref('');
const honeypot = ref(''); // Simple anti-spam measure

const captcha = reactive({
  num1: 0,
  num2: 0,
  userAnswer: '',
  correctAnswer: 0
});

const WP_USERNAME = import.meta.env.VITE_WP_USERNAME;
const WP_APPLICATION_PASSWORD = import.meta.env.VITE_WP_APPLICATION_PASSWORD;

const replyingTo = ref(null); // Tracks which comment we're replying to

const likedComments = ref(new Set());

const fetchPost = async (slug) => {
  try {
    const response = await axios.get(`https://blog.walterclayton.com/wp-json/wp/v2/posts`, {
      params: {
        slug: slug,
        _embed: true
      }
    });
    
    post.value = response.data[0];

    if (!post.value) {
      console.error('Post not found');
      return;
    }

    // Handle featured image
    if (post.value._embedded && post.value._embedded['wp:featuredmedia']) {
      const media = post.value._embedded['wp:featuredmedia'][0];

      // Try different image size options
      const imageUrl = media.source_url || 
                      media.media_details?.sizes?.full?.source_url ||
                      media.media_details?.sizes?.large?.source_url ||
                      media.guid?.rendered;

      featuredImage.value = {
        url: imageUrl,
        alt: media.alt_text || post.value.title.rendered,
        title: media.title?.rendered || '',
        description: media.description?.rendered || '',
        caption: media.caption?.rendered || ''
      };
    } else {
      featuredImage.value = {
        url: '',
        alt: '',
        title: '',
        description: '',
        caption: ''
      };
    }

    if (post.value._embedded.author) {
      authorName.value = post.value._embedded.author[0].name;
    }

    if (post.value._embedded['wp:term']) {
      categories.value = post.value._embedded['wp:term'].find(terms => terms[0]?.taxonomy === 'category') || [];
      tags.value = post.value._embedded['wp:term'].find(terms => terms[0]?.taxonomy === 'post_tag') || [];
    }

    insertMetaTags();
    await fetchComments(post.value.id);
    generateCaptcha();
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
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
      "@id": `https://blog.walterclayton.com/post/${post.value.slug}`
    },
    "keywords": tags.value.map(tag => tag.name).join(', '),
    "articleSection": categories.value.map(category => category.name).join(', ')
  });
});

const insertMetaTags = () => {
  if (!post.value) return;
  
  const head = document.head;

  // Remove existing meta tags first to avoid duplicates
  const existingMetas = head.querySelectorAll('meta[data-vue-meta="true"]');
  existingMetas.forEach(meta => meta.remove());

  const metaDescription = document.createElement('meta');
  metaDescription.name = 'description';
  metaDescription.content = post.value.excerpt.rendered.replace(/(<([^>]+)>)/gi, '');
  metaDescription.setAttribute('data-vue-meta', 'true');
  head.appendChild(metaDescription);

  // Open Graph tags
  const ogTitle = document.createElement('meta');
  ogTitle.setAttribute('property', 'og:title');
  ogTitle.content = post.value.title.rendered;
  ogTitle.setAttribute('data-vue-meta', 'true');
  head.appendChild(ogTitle);

  const ogDescription = document.createElement('meta');
  ogDescription.setAttribute('property', 'og:description');
  ogDescription.content = post.value.excerpt.rendered.replace(/(<([^>]+)>)/gi, '');
  ogDescription.setAttribute('data-vue-meta', 'true');
  head.appendChild(ogDescription);

  const ogImage = document.createElement('meta');
  ogImage.setAttribute('property', 'og:image');
  ogImage.content = featuredImage.value.url;
  ogImage.setAttribute('data-vue-meta', 'true');
  head.appendChild(ogImage);

  const ogUrl = document.createElement('meta');
  ogUrl.setAttribute('property', 'og:url');
  ogUrl.content = window.location.href;
  ogUrl.setAttribute('data-vue-meta', 'true');
  head.appendChild(ogUrl);

  // Add og:type
  const ogType = document.createElement('meta');
  ogType.setAttribute('property', 'og:type');
  ogType.content = 'article';
  ogType.setAttribute('data-vue-meta', 'true');
  head.appendChild(ogType);

  // Twitter Card tags
  const twitterCard = document.createElement('meta');
  twitterCard.setAttribute('name', 'twitter:card');
  twitterCard.content = 'summary_large_image';
  twitterCard.setAttribute('data-vue-meta', 'true');
  head.appendChild(twitterCard);

  const twitterTitle = document.createElement('meta');
  twitterTitle.setAttribute('name', 'twitter:title');
  twitterTitle.content = post.value.title.rendered;
  twitterTitle.setAttribute('data-vue-meta', 'true');
  head.appendChild(twitterTitle);

  const twitterDescription = document.createElement('meta');
  twitterDescription.setAttribute('name', 'twitter:description');
  twitterDescription.content = post.value.excerpt.rendered.replace(/(<([^>]+)>)/gi, '');
  twitterDescription.setAttribute('data-vue-meta', 'true');
  head.appendChild(twitterDescription);

  const twitterImage = document.createElement('meta');
  twitterImage.setAttribute('name', 'twitter:image');
  twitterImage.content = featuredImage.value.url;
  twitterImage.setAttribute('data-vue-meta', 'true');
  head.appendChild(twitterImage);

  // Facebook additional tags
  const fbAppId = document.createElement('meta');
  fbAppId.setAttribute('property', 'fb:app_id');
  fbAppId.content = ''; // Add your Facebook App ID if you have one
  fbAppId.setAttribute('data-vue-meta', 'true');
  head.appendChild(fbAppId);

  const articlePublishedTime = document.createElement('meta');
  articlePublishedTime.setAttribute('property', 'article:published_time');
  articlePublishedTime.content = post.value.date;
  articlePublishedTime.setAttribute('data-vue-meta', 'true');
  head.appendChild(articlePublishedTime);

  const articleModifiedTime = document.createElement('meta');
  articleModifiedTime.setAttribute('property', 'article:modified_time');
  articleModifiedTime.content = post.value.modified;
  articleModifiedTime.setAttribute('data-vue-meta', 'true');
  head.appendChild(articleModifiedTime);

  const articleAuthor = document.createElement('meta');
  articleAuthor.setAttribute('property', 'article:author');
  articleAuthor.content = authorName.value;
  articleAuthor.setAttribute('data-vue-meta', 'true');
  head.appendChild(articleAuthor);

  // LinkedIn uses Open Graph tags
  const ogSiteName = document.createElement('meta');
  ogSiteName.setAttribute('property', 'og:site_name');
  ogSiteName.content = 'Walter Clayton Blog';
  ogSiteName.setAttribute('data-vue-meta', 'true');
  head.appendChild(ogSiteName);

  // Make sure image is absolute URL
  let absoluteImageUrl = featuredImage.value.url;
  if (!absoluteImageUrl.startsWith('http')) {
    absoluteImageUrl = `https://blog.walterclayton.com${absoluteImageUrl}`;
  }
  if (absoluteImageUrl.startsWith('http://')) {
    absoluteImageUrl = absoluteImageUrl.replace('http://', 'https://');
  }
  
  // Update og:image with absolute HTTPS URL
  ogImage.content = absoluteImageUrl;
  
  // Add og:image:secure_url
  const ogImageSecureUrl = document.createElement('meta');
  ogImageSecureUrl.setAttribute('property', 'og:image:secure_url');
  ogImageSecureUrl.content = absoluteImageUrl;
  ogImageSecureUrl.setAttribute('data-vue-meta', 'true');
  head.appendChild(ogImageSecureUrl);
  
  // Add og:image:type
  const ogImageType = document.createElement('meta');
  ogImageType.setAttribute('property', 'og:image:type');
  ogImageType.content = 'image/jpeg'; // or 'image/png' depending on your image
  ogImageType.setAttribute('data-vue-meta', 'true');
  head.appendChild(ogImageType);

  // Add image dimensions if available
  const ogImageWidth = document.createElement('meta');
  ogImageWidth.setAttribute('property', 'og:image:width');
  ogImageWidth.content = '1200';
  ogImageWidth.setAttribute('data-vue-meta', 'true');
  head.appendChild(ogImageWidth);

  const ogImageHeight = document.createElement('meta');
  ogImageHeight.setAttribute('property', 'og:image:height');
  ogImageHeight.content = '630';
  ogImageHeight.setAttribute('data-vue-meta', 'true');
  head.appendChild(ogImageHeight);

  const keywordsMeta = document.createElement('meta');
  keywordsMeta.name = 'keywords';
  keywordsMeta.content = tags.value.map(tag => tag.name).join(', ');
  keywordsMeta.setAttribute('data-vue-meta', 'true');
  head.appendChild(keywordsMeta);

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = structuredData.value;
  script.setAttribute('data-vue-meta', 'true');
  head.appendChild(script);
};

const fetchComments = async (postId) => {
  try {
    const response = await axios.get(`https://blog.walterclayton.com/wp-json/wp/v2/comments`, {
      params: {
        post: postId,
        order: 'asc',
        orderby: 'date',
        per_page: 100,
      }
    });
    
    // Load liked comments from localStorage
    const likedComments = JSON.parse(localStorage.getItem('likedComments') || '[]');
    
    // Add hasLiked property to all comments recursively
    const addLikedState = (comments) => {
      return comments.map(comment => {
        comment.hasLiked = likedComments.includes(comment.id);
        if (comment.replies && comment.replies.length) {
          comment.replies = addLikedState(comment.replies);
        }
        return comment;
      });
    };
    
    comments.value = addLikedState(response.data);
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

const generateCaptcha = () => {
  captcha.num1 = Math.floor(Math.random() * 10);
  captcha.num2 = Math.floor(Math.random() * 10);
  captcha.correctAnswer = captcha.num1 + captcha.num2;
  captcha.userAnswer = '';
};

const startReply = (commentId, authorName) => {
  replyingTo.value = {
    id: commentId,
    authorName: authorName
  };
  // Scroll to comment form
  document.querySelector('#commentForm').scrollIntoView({ behavior: 'smooth' });
};

const cancelReply = () => {
  replyingTo.value = null;
};

const submitComment = async () => {
  // Check honeypot (if filled, it's likely a bot)
  if (honeypot.value) {
    commentSuccess.value = 'Comment submitted successfully!'; // Show success to bot
    return;
  }

  if (!newComment.content || !newComment.author) {
    commentError.value = 'Please fill in the required fields';
    return;
  }

  // Verify CAPTCHA
  if (parseInt(captcha.userAnswer) !== captcha.correctAnswer) {
    commentError.value = 'Incorrect math answer. Please try again.';
    generateCaptcha(); // Generate new numbers
    return;
  }

  isSubmitting.value = true;
  commentError.value = '';
  
  try {
    const authString = btoa(`${WP_USERNAME}:${WP_APPLICATION_PASSWORD}`);
    
    const commentData = {
      post: post.value.id,
      author_name: newComment.author,
      author_email: newComment.email || 'anonymous@example.com',
      content: newComment.content,
      meta: {
        user_agent: navigator.userAgent,
        timestamp: Date.now()
      }
    };

    // Add parent comment ID if this is a reply
    if (replyingTo.value) {
      commentData.parent = replyingTo.value.id;
    }
    
    const response = await axios.post(`https://blog.walterclayton.com/wp-json/wp/v2/comments`, 
      commentData,
      {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    );

    // Clear form and show success message
    newComment.author = '';
    newComment.email = '';
    newComment.content = '';
    honeypot.value = '';
    replyingTo.value = null; // Reset reply state
    commentSuccess.value = 'Comment submitted successfully!';
    
    // Refresh comments immediately since moderation is off
    await fetchComments(route.params.id);

    // Generate new CAPTCHA
    generateCaptcha();

    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      commentSuccess.value = '';
    }, 3000);

  } catch (error) {
    console.error('Comment submission error:', error);
    commentError.value = error.response?.data?.message || 'Error submitting comment. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

// Add this computed property to organize comments into threads
const threadedComments = computed(() => {
  const commentMap = new Map();
  const topLevelComments = [];

  // First pass: create a map of all comments
  comments.value.forEach(comment => {
    comment.replies = [];
    commentMap.set(comment.id, comment);
  });

  // Second pass: organize into threads
  comments.value.forEach(comment => {
    if (comment.parent === 0) {
      topLevelComments.push(comment);
    } else {
      const parent = commentMap.get(comment.parent);
      if (parent) {
        parent.replies.push(comment);
      }
    }
  });

  return topLevelComments;
});

// Add this new function
const getCommentFormPosition = computed(() => {
  return replyingTo.value ? `comment-${replyingTo.value.id}` : 'main-comment-form';
});

// Add this function to recursively update likes
const updateCommentLikes = (comments, commentId, likes) => {
  return comments.map(comment => {
    if (comment.id === commentId) {
      return {
        ...comment,
        meta: { ...comment.meta, likes_count: likes },
        hasLiked: true
      };
    }
    if (comment.replies && comment.replies.length) {
      return {
        ...comment,
        replies: updateCommentLikes(comment.replies, commentId, likes)
      };
    }
    return comment;
  });
};

// Update the handleCommentLike function
const handleCommentLike = ({ commentId, likes }) => {
  // Update the likes count in the comments tree
  comments.value = updateCommentLikes(comments.value, commentId, likes);
  
  // Store liked state in localStorage
  const likedComments = JSON.parse(localStorage.getItem('likedComments') || '[]');
  if (!likedComments.includes(commentId)) {
    likedComments.push(commentId);
    localStorage.setItem('likedComments', JSON.stringify(likedComments));
  }
};

// Start loading project items on mount
onMounted(() => {
  const slug = route.params.slug;
  fetchPost(slug);
  // fetchComments will be called after fetchPost succeeds and we have the post ID

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

:deep(.blog-content) {
  /* Paragraph spacing */
  p {
    margin-bottom: 1.5rem;
    line-height: 1.75;
  }

  /* Headers */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #1a202c;
  }

  h1 { font-size: 2.25rem; }
  h2 { font-size: 1.875rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.25rem; }

  /* Links */
  a {
    color: #3182ce;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #2c5282;
      text-decoration: underline;
    }
  }

  /* Lists */
  ul, ol {
    margin: 1.5rem 0;
    padding-left: 2rem;

    li {
      margin-bottom: 0.5rem;
    }
  }

  /* Buttons */
  button {
    background-color: #4a5568;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s;

    &:hover {
      background-color: #2d3748;
    }
  }

  /* Horizontal Rule */
  hr {
    margin: 2rem 0;
    border: 0;
    border-top: 1px solid #e2e8f0;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    margin: 1.5rem auto;
    border-radius: 0.5rem;
  }

  /* Blockquotes */
  blockquote {
    margin: 1.5rem 0;
    padding: 1rem 1.5rem;
    border-left: 4px solid #4a5568;
    background-color: #f7fafc;
    font-style: italic;
  }

  /* Code blocks */
  pre {
    background-color: #2d3748;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  /* Tables */
  table {
    width: 100%;
    margin: 1.5rem 0;
    border-collapse: collapse;

    th, td {
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
    }

    th {
      background-color: #f7fafc;
      font-weight: 600;
    }
  }
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
