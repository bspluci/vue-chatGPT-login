<template>
  <div>
    <div style="display: flex; align-items: center">
      <nuxt-link to="/">HOME</nuxt-link>

      <div v-if="showLoginText">
        <nuxt-link to="/login">로그인</nuxt-link>
      </div>
      <div v-else>
        <button @click="deleteMemberInfo">로그아웃</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      showLoginText: false,
    };
  },
  mounted() {
    this.showLoginText = this.$store.state.memberInfo.memberInfo ? false : true;
  },
  computed: {
    isLogin() {
      return this.$store.state.memberInfo.memberInfo;
    },
  },
  watch: {
    isLogin(val) {
      this.showLoginText = val ? false : true;
    },
  },
  methods: {
    async deleteMemberInfo() {
      this.$store.commit("memberInfo/setMemberInfo", null);
      this.$store.commit("auth/setAuth", "");
    },
  },
};
</script>
