<script setup>
import Logo from "./icons/IconLogo.vue";
</script>
<template>
    <div class="nav-container">
        <nav class="logo-mobile">
            <Logo/>
        </nav>
        <nav class="nav-container-desktop">
            <div class="nav-item">
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </div>
        </nav>
    </div>
</template>
<style scoped lang="scss">
.nav-container{
    list-style: none;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    overflow-x: auto;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: #507A95;
}
.nav-item {
  padding: 0;
  margin: 0 16px;
  color: #fff;
  font-size: 0.9em;
  box-sizing: border-box;
  flex-shrink: 0;

  & > a {
    text-decoration: none;
    padding: 15px;
    display: inline-block;
    line-height: 2em;
    border-bottom: 3px solid;
    border-bottom-color: transparent;
    /* Use for semantic approach to style the current link */
    &[aria-current="page"] {
      color: #F9AA8F;
      font-weight: 600;
    }
  }

  &:first-of-type {
    margin-left: 0;
  }

  &:last-of-type {
    margin-right: 0;

    &:after {
      content: "";
      display: inline-block;
      width: 24px;
    }
  }
}
</style>