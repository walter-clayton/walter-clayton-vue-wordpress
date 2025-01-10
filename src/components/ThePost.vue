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
      
      <!-- Social Share Buttons -->
      <div class="flex justify-center items-center mt-8 mb-4 space-x-4">
        <a 
          :href="twitterShareUrl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="flex items-center px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
        >
          <svg class="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          Share on Twitter
        </a>
        
        <a 
          :href="facebookShareUrl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="flex items-center px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166fe5] transition-colors"
        >
          <svg class="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Share on Facebook
        </a>
        
        <a 
          :href="linkedInShareUrl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="flex items-center px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#094ea0] transition-colors"
        >
          <svg class="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Share on LinkedIn
        </a>
      </div>
      
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
  ogUrl.content = `https://blog.walterclayton.com/${post.value.slug}`;
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
  return `https://twitter.com/intent/tweet?url=https://blog.walterclayton.com/post/${post.value.slug}&text=${encodeURIComponent(post.value.title.rendered)}`;
});

const facebookShareUrl = computed(() => {
  if (!post.value) return '';
  return `https://www.facebook.com/sharer/sharer.php?u=https://blog.walterclayton.com/post/${post.value.slug}`;
});

const linkedInShareUrl = computed(() => {
  if (!post.value) return '';
  return `https://www.linkedin.com/sharing/share-offsite/?url=https://blog.walterclayton.com/post/${post.value.slug}`;
});

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
