<template>
  <div>
    <div>
      <h1 class="profile">
        <div class="profile_image" v-if="member.name" ref="profileWrap">
          <img
            ref="profileImg"
            :src="`http://localhost:8080${member.profileImage}`"
            @load="fitImageScreen"
          />
        </div>
        <div v-else></div>
        <div class="profile_Text">
          <p v-if="member.name">{{ member.name }}님</p>
          <p>안녕하세요.</p>
        </div>
      </h1>
    </div>

    <Member />
    <br />
    <Banner />
    <nuxt />
  </div>
</template>

<script lang="ts">
import Util from "../module/Util";

interface Data {
  member: {
    name: string | null;
    profileImage?: string;
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
  name: "default",
  data(): Data {
    return {
      member: {
        name: null,
        profileImage: "",
      },
    };
  },
  computed: {
    setMemberName() {
      return this.$store.state.member.memberInfo || null;
    },
    setProfileImage() {
      return this.$store.state.member.memberInfo?.profile;
    },
  },
  watch: {
    setMemberName(val?: Member | null) {
      this.member.name = val?.name || null;
    },
    setProfileImage(val?: string) {
      this.member.profileImage = val;
    },
  },
  mounted() {
    this.member.name = this.$store.state.member?.memberInfo?.name || null;
    this.member.profileImage =
      this.$store.state.member?.memberInfo?.profile || null;
  },
  methods: {
    fitImageScreen() {
      let profileWrap = this.$refs.profileWrap as HTMLDivElement;
      let profileImg = this.$refs.profileImg as HTMLImageElement;

      Util.getImageReSize(profileWrap, profileImg);
    },
  },
};
</script>

<style scoped>
.profile {
  display: flex;
  align-items: center;
  padding: 0 20px 10px 20px;
  margin-bottom: 10px;
  border-bottom: 3px solid #cdcd;
  font-size: 28px;
}
.profile_image {
  overflow: hidden;
  width: 100px;
  height: 100px;
  margin-right: 10px;
  border-radius: 50%;
}
.profile_image img {
  width: 100%;
}
.profile_Text {
  line-height: normal;
}
</style>
