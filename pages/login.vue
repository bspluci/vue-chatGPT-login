<template>
  <div>
    <div>
      <label>아이디</label>
      <input
        type="text"
        v-model="memberId"
        @keypress.enter="passwordCursor()"
      />
    </div>
    <div>
      <label>비밀번호</label>
      <input
        ref="passwordInput"
        type="password"
        v-model="memberPw"
        @keypress.enter="login()"
      />
    </div>
    <button @click="login()">로그인</button>
  </div>
</template>

<script lang="ts">
import Util from "../module/Util";

interface Data {
  memberId: string;
  memberPw: string;
}

type Res = void | any;

export default {
  name: "login",
  data(): Data {
    return {
      memberId: "",
      memberPw: "",
    };
  },
  mounted() {
    // this.$route.query.alert === "true" ? alert("로그인해주세요~") : null;
  },
  methods: {
    passwordCursor() {
      let passwordInput = this.$refs.passwordInput;
      if (passwordInput instanceof HTMLInputElement) {
        passwordInput.focus();
      }
    },
    async login() {
      const param = {
        memberId: this.memberId,
        memberPassword: this.memberPw,
      };

      const res: Res = await Util.post({
        self: this,
        url: "https://stg.ebsoc.co.kr/auth/api/v1/login",
        params: param,
      });

      if (res.data.status === 404) {
        this.memberId = "";
        this.memberPw = "";
        return alert(res.data.message);
      }

      if (res?.data?.data) {
        this.$store.commit(
          "memberInfo/setMemberInfo",
          res.data.data.memberInfo
        );
        this.$store.commit("auth/setAuth", res.data.data.token);
        this.$router.push("/");
      } else {
        alert("로그인 실패");
      }
    },
  },
};
</script>
