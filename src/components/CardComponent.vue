<template>
  <section>
    <article v-for="project in resolvedProjects" :key="project.id" class="main-article container">
      <img :src="project.featureImage" :alt="project.title" class="featured-image"/>
      <h3 class="title">{{ project.title }}</h3>
      <div class="description">{{ project.description }}</div>
      <div class="link">
        <a :href="project.link" target="_blank" rel="noopener noreferrer">Link</a>
      </div>
    </article>
  </section>
</template>

<script>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'CardComponent',
  props: {
    projects: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const route = useRoute()

    const resolveImagePath = (path) => {
      return new URL(`../assets/${path.split('/').pop()}`, import.meta.url).href
    }

    const resolvedProjects = computed(() => {
      return props.projects.map(project => {
        if (project.featureImage) {
          project.featureImage = resolveImagePath(project.featureImage)
        }
        return project
      })
    })

    const resolveAllImages = () => {
      resolvedProjects.value.forEach(project => {
        if (project.featureImage) {
          project.featureImage = resolveImagePath(project.featureImage)
        }
      })
    }

    onMounted(() => {
      resolveAllImages()
    })

    watch(route, () => {
      resolveAllImages()
    })

    return { resolvedProjects }
  }
}
</script>

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
  border-radius: 25px; 
  box-sizing: border-box;
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

.description {
  line-height: 1.5em;
  color: rgba(12, 17, 43, 0.8);
  flex-grow: 1;
  margin-bottom: 20px;
}

.link {
  background: #507A95;
  border-radius: 25px; 
  padding: 10px 20px;
  color: white;
  align-self: flex-start; 
}
</style>
