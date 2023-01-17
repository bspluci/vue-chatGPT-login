<template>
  <div>
    <br />
    <div style="margin-bottom: 15px">
      <label class="input-label">이메일</label>
      <input
        ref="inputEmail"
        type="text"
        v-model="param.email"
        @keypress.enter="passwordCursor()"
      />
    </div>
    <div>
      <label class="input-label">비밀번호</label>
      <input
        ref="inputPassword"
        type="password"
        v-model="param.password"
        @keypress.enter="login()"
      />
    </div>
    <br />
    <button class="btn btn-success" @click="login()">로그인</button>
    <button class="btn btn-warning" @click="$router.push('/register')">
      회원가입
    </button>
  </div>
</template>

<script lang="ts">
import Util from "../module/Util";
import { mapMutations } from "vuex";

interface Data {
  param: {
    email: string;
    password: string;
  };
}

type Res = void | any;

export default {
  name: "login",
  data(): Data {
    return {
      param: {
        email: "",
        password: "",
      },
    };
  },
  mounted() {
    if (this.$store.state.auth.token) this.$router.push("/");
  },
  methods: {
    ...mapMutations("auth", {
      setAuth: "setAuth",
    }),
    ...mapMutations("memberInfo", {
      setMemberInfo: "setMemberInfo",
    }),
    passwordCursor() {
      let passwordInput = this.$refs.passwordInput;
      if (passwordInput instanceof HTMLInputElement) {
        passwordInput.focus();
      }
    },
    async login() {
      let resLogin = await Util.post({
        self: this,
        url: "http://localhost:8080/api/member/login",
        params: this.param,
      });

      if (resLogin.data.status === 200) {
        this.setAuth(resLogin.data.token);

        await Util.post({
          self: this,
          url: "http://localhost:8080/api/member/userInfo",
          params: this.param,
        }).then((res: Res) => {
          if (res.data.status === 200) {
            this.setMemberInfo(res.data.data);
          }
          this.$router.push("/");
        });
      } else {
        this.param.email = "";
        this.param.password = "";
      }
    },
  },
};
</script>
