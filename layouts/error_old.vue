<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-else-if="error.statusCode === 500">Sorry, server failure</h1>
    <h2 v-else>An error occurred</h2>

    <div>
      <nuxt-link v-if="error.statusCode === 404" to="/">Home page</nuxt-link>
      <a href="/" v-else @click="$router.go()">Home page</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "dark",
};
</script>
