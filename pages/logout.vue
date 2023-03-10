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
    ...mapMutations("member", {
      setMemberInfo: "setMemberInfo",
    }),
    async logout() {
      const message = this.$route.query.activeTime
        ? "사용시간이 만료되어 로그아웃됩니다."
        : "로그아웃 되었습니다.";

      this.$store.commit("auth/resetStore");
      this.$store.commit("activeTime/resetStore");
      Util.logout(this);
      alert(message);
    },
  },
};
</script>
