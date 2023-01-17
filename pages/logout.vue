<template>
  <div></div>
</template>

<script lang="ts">
import Util from "../module/Util";
import { mapMutations } from "vuex";

export default {
  name: "logout",
  data() {
    return {};
  },
  created() {
    this.logout();
    this.$router.push("/");
  },
  mounted() {},
  methods: {
    ...mapMutations("auth", {
      setAuth: "setAuth",
    }),
    ...mapMutations("memberInfo", {
      setMemberInfo: "setMemberInfo",
    }),
    async logout() {
      Util.logout(this);
      alert("로그아웃 되었습니다.");
    },
  },
};
</script>
