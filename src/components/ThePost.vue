<template>
  <section>
    <div v-if="post" class="container">
      <h1 v-html="post.title?.rendered"></h1>
      <p>{{ authorName }}</p>
      <p>{{ formatDate(post.date) }}</p>
      <p v-html="post.content?.rendered"></p>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onBeforeMount } from 'vue';
import axios from 'axios'

const postId = ref(null);
const route = useRoute()
const post = ref({});
const authorName = ref('');

const fetchPost = async () => {
  try {
    const response = await axios.get(`https://blog.walterclayton.com/wp-json/wp/v2/posts/${postId.value}`);
    post.value = response.data; // Assign the response data directly to the post object

    // Fetch author details
    await fetchAuthor(post.value.author);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const fetchAuthor = async (authorId) => {
  try {
    const response = await axios.get(`https://blog.walterclayton.com/wp-json/wp/v2/users/${authorId}`);
    authorName.value = response.data.name; // Extract the author's display name
  } catch (error) {
    console.error("Error fetching author data:", error);
  }
}

onBeforeMount(async () => {
  // Check if route and route.params are available
  if (route && route.params) {
    postId.value = route.params.id;
  }
  await fetchPost();
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
</script>


<style scoped>
section {
  background-color: white;
  border-radius: 5px;
  width: 95%;
  width: 800px;
  margin: auto;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
}

.container {
  padding: 25px;
}

@media (max-width: 992px) {
  section {
    width: 100%;
    flex-direction: column;
    margin: auto;
  }
  .container {
  padding: 15px;
}
}

h1 {
  font-size: 32px;
  line-height: 1.5;
  margin: 0;
  margin-top: 24px;
  margin-bottom: 8px;
  color: rgba(12, 17, 43);
}

p {
  font-size: 22px;
  line-height: 1.3;
  margin: 0;
  margin-top: 18px;
  color: rgba(117, 117, 117, 1);
}

p.date-wrapper {
  font-size: 22px;
  line-height: 1.3;
  font-weight: 400;
  margin: 0;
  margin-top: 18px;
  color: rgba(117, 117, 117, 1);
}

div {
  color: rgba(12, 17, 43, 0.8);
  word-break: break-word;
}

div * {
  max-width: 100%;
}

@media (max-width: 992px) {
  div p {
    font-size: 18px;
  }
}

img {
  width: 100%;
  object-fit: cover;
  object-position: center;
}

figure {
  margin: 24px auto;
  width: 100%;
}

figure > figcaption {
  font-size: 0.7em;
}

iframe {
  display: block;
  margin: auto;
}

blockquote {
  margin: 16px 0;
  background-color: rgba(0, 0, 0, 0.1);
  border-left: 4px solid rgba(12, 17, 43);
  padding: 4px 16px;
}

a {
  color: rgb(31, 56, 197);
  text-decoration: underline;
}

/* Input fields styles */

input[type="text"],
input[type="email"],
input[type="url"],
input[type="tel"],
input[type="number"],
input[type="date"],
textarea,
select {
  display: block;
  padding: 6px 12px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 4px;
  outline-color: transparent;
  transition: outline-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  margin: 8px 0 4px 0;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="url"]:focus,
input[type="tel"]:focus,
input[type="number"]:focus,
input[type="date"]:focus,
textarea:focus,
select:focus {
  outline-color: #507A95;
}

input[type="submit"] {
  display: inline-block;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid #507A95;
  padding: 12px 36px;
  font-size: 14px;
  line-height: 1.42857143;
  border-radius: 4px;
  color: #fff;
  background-color: #507A95;
}

/* WordPress Core Align Classes */

@media (min-width: 420px) {
  img.aligncenter,
  img.alignleft,
  img.alignright {
    width: auto;
  }

  .aligncenter {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .alignright {
    float: right;
    margin-left: 24px;
  }

  .alignleft {
    float: left;
    margin-right: 24px;
  }
}

</style>