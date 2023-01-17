<template>
  <div>
    <div>
      <h1 style="font-size: 28px">
        안녕하세요. <span v-if="member.name">{{ member.name }}님</span>
      </h1>
    </div>

    <Member />
    <nuxt />
  </div>
</template>

<script lang="ts">
interface Data {
  member: {
    name: string | null;
  };
}

interface Member {
  email: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
  updateAt: string;
}

export default {
  data(): Data {
    return {
      member: {
        name: null,
      },
    };
  },
  computed: {
    setMemberName() {
      return this.$store.state.memberInfo.memberInfo || null;
    },
  },
  watch: {
    setMemberName(val?: Member | null) {
      this.member.name = val?.name || null;
    },
  },
  mounted() {
    this.member.name = this.$store.state.memberInfo?.memberInfo?.name || null;
  },
  methods: {},
};
</script>

<style scoped></style>
