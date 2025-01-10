<template>
  <div :class="[
    'comment-thread',
    level > 0 ? 'mt-4 ml-6' : '',
    level > 0 ? 'border-l-2 border-gray-300' : ''
  ]">
    <div :class="[
      'p-4 rounded-lg',
      level === 0 ? 'bg-gray-50' : 'bg-gray-100'
    ]">
      <div class="flex items-center mb-2">
        <span class="font-semibold">{{ comment.author_name }}</span>
        <span class="ml-2 text-sm text-gray-500">{{ formatDate(comment.date) }}</span>
      </div>
      <div v-html="comment.content.rendered" class="text-gray-700"></div>
      <div class="flex items-center mt-2 space-x-4">
        <button 
          @click="$emit('reply', comment.id, comment.author_name)"
          class="text-sm text-blue-600 hover:text-blue-800"
        >
          Reply
        </button>
        <button 
          @click="handleLike(comment.id)"
          :disabled="comment.hasLiked"
          class="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
          :class="{ 'text-red-500 hover:text-red-600': comment.hasLiked }"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="w-5 h-5" 
            :class="{ 'fill-current': comment.hasLiked }"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
          <span>{{ comment.meta?.likes_count || 0 }} likes</span>
        </button>
      </div>

      <!-- Comment Form when replying to this comment -->
      <div v-if="replyingTo?.id === comment.id" class="mt-4">
        <div class="p-6 bg-white rounded-lg shadow-sm" :id="`comment-${comment.id}`">
          <h3 class="mb-4 text-xl font-semibold">
            Reply to {{ comment.author_name }}
          </h3>
          
          <button 
            @click="$emit('cancel-reply')"
            class="mb-4 text-sm text-gray-600 hover:text-gray-800"
          >
            ← Cancel reply
          </button>

          <CommentForm 
            :comment-success="commentSuccess"
            :comment-error="commentError"
            :new-comment="newComment"
            :captcha="captcha"
            :honeypot="honeypot"
            :is-submitting="isSubmitting"
            @update:honeypot="$emit('update:honeypot', $event)"
            @submit="$emit('submit')"
          />
        </div>
      </div>

      <!-- Nested replies -->
      <div v-if="comment.replies && comment.replies.length > 0">
        <CommentThread
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
          :level="level + 1"
          :replying-to="replyingTo"
          :comment-success="commentSuccess"
          :comment-error="commentError"
          :new-comment="newComment"
          :captcha="captcha"
          :honeypot="honeypot"
          :is-submitting="isSubmitting"
          @reply="$emit('reply', $event)"
          @cancel-reply="$emit('cancel-reply')"
          @submit="$emit('submit')"
          @update:honeypot="$emit('update:honeypot', $event)"
          @like="$emit('like', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CommentForm from '@/components/CommentForm.vue';
import axios from 'axios';

defineProps({
  comment: Object,
  level: {
    type: Number,
    default: 0
  },
  replyingTo: Object,
  commentSuccess: String,
  commentError: String,
  newComment: Object,
  captcha: Object,
  honeypot: String,
  isSubmitting: Boolean
});

const emit = defineEmits(['reply', 'cancel-reply', 'submit', 'update:honeypot', 'like']);

const formatDate = (dateString) => {
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', options);
};

const handleLike = async (commentId) => {
  if (comment.hasLiked) return; // Prevent multiple likes
  
  try {
    const response = await axios.post(
      `https://blog.walterclayton.com/wp-json/wp/v2/comments/${commentId}/like`,
      {},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status === 200) {
      emit('like', { 
        commentId, 
        likes: response.data.likes_count 
      });
    }
  } catch (error) {
    console.error('Error liking comment:', error);
  }
};
</script>

<style scoped>
.comment-thread {
  position: relative;
}

/* Add visual indicators for deep nesting */
.comment-thread:nth-child(odd) {
  border-left-color: #e5e7eb;
}

.comment-thread:nth-child(even) {
  border-left-color: #d1d5db;
}

/* Adjust spacing for very deep nesting */
@media (max-width: 768px) {
  .comment-thread {
    margin-left: 0.5rem;
  }
}
</style>

<script>
export default {
  name: 'CommentThread'
}
</script> 