<template>
  <div>
    <div style="display: flex; align-items: center; padding: 0 20px">
      <nuxt-link to="/" class="btn btn-primary" style="margin-right: 10px"
        >HOME</nuxt-link
      >

      <div v-if="showLoginText">
        <nuxt-link to="/login" class="btn btn-secondary">로그인</nuxt-link>
      </div>
      <div v-else>
        <button @click="logout()" class="btn btn-secondary">로그아웃</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "member",
  data() {
    return {
      showLoginText: true,
    };
  },
  mounted() {
    this.showLoginText = this.$store.state.auth.token ? false : true;
  },
  computed: {
    isLogin() {
      return this.$store.state.auth.token;
    },
  },
  watch: {
    isLogin(val) {
      this.showLoginText = val ? false : true;
    },
  },
  methods: {
    async logout() {
      this.$router.push("/logout");
    },
  },
};
</script>
