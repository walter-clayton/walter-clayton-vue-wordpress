<template>
<div class="container">
  <div class="jumbotron-container">
    <div class="block-1">
      <component :is="svgComponent" />
    </div>
    <div class="block-2">
      <h1 class="title">{{ title }}</h1>
      <h2 class="subtitle">{{ subtitle }}</h2>
      <p v-if="description">{{ description }}</p>
      <div v-if="buttons" class="cta-buttons">
        <a v-for="button in buttons" :key="button.text" :href="button.link" :class="button.class">{{ button.text }}</a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Default Title',
      subtitle: 'Default Subtitle',
      description: '',
      buttons: [],
      svgComponent: null,
    };
  },
  watch: {
    '$route'(to) {
      console.log('Route changed:', to.meta);
      this.updateContent();
    }
  },
  created() {
    console.log('Component created with route meta:', this.$route.meta);
    this.updateContent();
  },
  methods: {
    updateContent() {
      this.title = this.$route.meta.title || 'Default Title';
      this.subtitle = this.$route.meta.subtitle || 'Default Subtitle';
      this.description = this.$route.meta.description || '';
      this.buttons = this.$route.meta.buttons || [];
      this.loadSVG();
    },
    async loadSVG() {
      const svgComponentName = this.$route.meta.svg || 'DefaultSVG';
      try {
        this.svgComponent = (await import(`@/assets/svgs/${svgComponentName}.vue`)).default;
      } catch (error) {
        console.error('Error loading SVG component:', error);
      }
    }
  }
}
</script>

<style scoped>
/* Additional Styles for Buttons */
.cta-buttons {
  margin-top: 20px;
}

.btn-primary, .btn-secondary {
  display: inline-block;
  padding: 10px 20px;
  margin: 5px;
  font-size: 1em;
  text-decoration: none;
  border-radius: 15px;
}

.btn-primary {
  background-color: #202733;
  color: #ffffff;

}

.btn-secondary {
  background-color: #ffffff;
  color: #47758c;
  border: 2px solid #202733;
}

.btn-primary:hover {
    background-color: #202733;
}
.btn-secondary:hover{
    background-color: #202733;
    color: #ffffff;
    border: 2px solid #202733;
}

/* Existing Styles */
.container {
    background-color: #D3C9BB;
}

.jumbotron-container {
    margin: auto;
    max-width: 1200px;
    width: 90%;
    display: flex;
    justify-content: space-evenly;
    color: black;
    overflow: hidden;
    padding-bottom: 20px;
}

@media screen and (max-width: 992px) {
    .container{
        width: 100%;
    }
    .jumbotron-container {
        flex-direction: column;
        text-align: center;
        border-radius: 0; 
    }
}

.block-1 {
    padding: 20px;
    align-self: center;
    width: inherit;
}
.block-2 {
    padding: 20px;
    align-self: center;
    width: inherit;
}

.title {
    font-size: 36px;
}

.subtitle {
    font-size: 16px;
}

svg {
    color: #F9AA8F;
}

@media only screen and (min-width: 768px) {
        .block-1 {
            width: 40%
        }
        .block-1 {
            width: 60%
        }
    } 

/* Animations */
@keyframes horizontalScroll {
    0% {
        transform: translate3d(0, 8%, 0);
    }
    100% {
        transform: translate3d(0, -2%, 0);
    }
}

@keyframes halfOpactiy {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 0.5;
    }
}

@keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
}

.appear-one{
    animation: halfOpactiy 1s 1 forwards;
    opacity: 0;
}

.appear-two{
    animation: halfOpactiy 1s 0.5s 1 forwards;
    opacity: 0;
}

.appear-three{
    animation: halfOpactiy 1s 1s 1 forwards;
    opacity: 0;
}

.appear-four{
    animation: halfOpactiy 1s 1.5s 1 forwards;
    opacity: 0;
}

.appear-five{
    animation: halfOpactiy 1s 2s 1 forwards;
    opacity: 0;
}

.screen-writing-scroll {
    padding: 100px;
    color: red !important;
    animation: horizontalScroll 5s forwards 1;
}

</style>