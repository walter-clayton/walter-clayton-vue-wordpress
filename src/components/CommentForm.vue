<template>
  <div>
    <div v-if="commentSuccess" class="p-3 mb-4 text-green-700 bg-green-100 rounded">
      {{ commentSuccess }}
    </div>
    
    <div v-if="commentError" class="p-3 mb-4 text-red-700 bg-red-100 rounded">
      {{ commentError }}
    </div>

    <form @submit.prevent="$emit('submit')" class="space-y-4">
      <div>
        <label for="name" class="block mb-1 text-sm font-medium text-gray-700">Name *</label>
        <input
          id="name"
          v-model="newComment.author"
          type="text"
          required
          class="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <div>
        <label for="email" class="block mb-1 text-sm font-medium text-gray-700">
          Email (optional)
          <span class="text-sm text-gray-500">- for notifications of replies</span>
        </label>
        <input
          id="email"
          v-model="newComment.email"
          type="email"
          class="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <!-- Honeypot field -->
      <div class="hidden">
        <input
          type="text"
          :value="honeypot"
          @input="$emit('update:honeypot', $event.target.value)"
          autocomplete="off"
          tabindex="-1"
        />
      </div>

      <div>
        <label for="comment" class="block mb-1 text-sm font-medium text-gray-700">Comment *</label>
        <textarea
          id="comment"
          v-model="newComment.content"
          required
          rows="4"
          class="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Please solve this math problem to prove you're human *
        </label>
        <div class="flex items-center space-x-2">
          <span class="text-lg">{{ captcha.num1 }} + {{ captcha.num2 }} = </span>
          <input
            type="number"
            v-model="captcha.userAnswer"
            required
            class="px-3 py-2 w-20 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="?"
          >
        </div>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {{ isSubmitting ? 'Submitting...' : 'Submit Comment' }}
      </button>
    </form>
  </div>
</template>

<script setup>
defineProps({
  commentSuccess: String,
  commentError: String,
  newComment: Object,
  captcha: Object,
  honeypot: String,
  isSubmitting: Boolean
});

defineEmits(['submit', 'update:honeypot']);
</script>

<script>
export default {
  name: 'CommentForm'
}
</script> 