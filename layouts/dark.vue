<template>
  <div :class="darkOn ? 'bg_dark' : ''">
    <button @click="changeBg">배경 바꾸기</button>
    <nuxt />
  </div>
</template>

<script lang="ts">
import { mapMutations } from "vuex";

export default {
  computed: {
    darkOn(): boolean {
      return this.$store.state.changeStyle.dark;
    },
  },
  methods: {
    ...mapMutations({
      changeStyle: "changeStyle/changeStyle",
    }),
    changeBg() {
      this.$store.commit("changeStyle/changeStyle"); // store 폴더 changeStyle 파일의 changeStyle 함수에 접근
    },
  },
};
</script>

<style scoped>
.bg_dark {
  background: #000;
  color: #fff;
}
</style>
