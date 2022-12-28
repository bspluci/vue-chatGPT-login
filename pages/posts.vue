<template>
  <div>
    <div>포스트를 생성하세요!</div>
    <button @click="getMemberInfo">회원정보 불러오기</button>
    <button @click="$router.go(-1)">뒤로가기</button>
    <div>쿠키에서 가져온 memseq값 : {{ memberSeq }}</div>
  </div>
</template>

<script lang="ts">
interface Data {
  memberSeq: number | string;
}

export default {
  layout: "blog",
  asyncData(context: { [key: string]: any }) {},
  data(): Data {
    return {
      memberSeq: "",
    };
  },
  mounted() {
    this.showMemberSeq();
  },
  methods: {
    async getMemberInfo() {
      let url = "/cls/api/v1/member";

      // nuxt 내장 axios 사용, nuxt.config.js 에서 기본 헤더값, baseURL등 셋팅 가능
      await this.$axios.$get(url);
    },
    showMemberSeq() {
      this.memberSeq = this.$cookies.get("memberSeq");
    },
  },
};
</script>

<style scoped></style>
