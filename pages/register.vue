<template>
  <div>
    <div class="input-wrap">
      <div class="input-group">
        <label class="input-label">이름</label>
        <input
          ref="inputName"
          type="text"
          v-model="param.name"
          @keypress.enter="userRegister()"
        />
      </div>
      <div class="input-group">
        <label class="input-label">이메일</label>
        <input
          ref="inputEmail"
          type="text"
          v-model="param.email"
          @keypress.enter="userRegister()"
        />
      </div>
      <div class="input-group">
        <label class="input-label">비밀번호</label>
        <input
          ref="inputPassword"
          type="password"
          v-model="param.password"
          @keypress.enter="userRegister()"
        />
      </div>
      <div class="input-group">
        <label class="input-label">비밀번호 확인</label>
        <input
          ref="inputPasswordRe"
          type="password"
          v-model="param.passwordRe"
          @keypress.enter="userRegister()"
        />
      </div>
      <div class="input-group">
        <label class="input-label">전화번호</label>
        <input
          ref="inputPhone"
          type="text"
          v-model="param.phoneNumber"
          @keypress.enter="userRegister()"
        />
      </div>
      <button class="btn btn-success" @click="userRegister()">회원가입</button>
    </div>
  </div>
</template>

<script lang="ts">
import Util from "../module/Util";

interface Param {
  name: string;
  email: string;
  password: string;
  passwordRe: string;
  phoneNumber: string;
}

interface Data<T> {
  param: T;
}

interface Res {
  [key: string]: any;
}

export default {
  name: "register",
  data(): Data<Param> {
    return {
      param: {
        name: "",
        email: "",
        password: "",
        passwordRe: "",
        phoneNumber: "",
      },
    };
  },
  mounted() {},
  methods: {
    init() {
      Object.keys(this.param).forEach((key) => this.param[key as keyof Param]);
    },
    async userRegister() {
      if (this.userValidation()) return;

      let res = await Util.post({
        self: this,
        url: "http://localhost:8080/api/member/register",
        params: this.param,
      })
        .then((res: Res) => {
          if (res.data.status === 200) {
            alert("회원가입이 완료됐습니다.");
            this.$router.push("/login");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    userValidation() {
      let userKey = Object.keys(this.param).filter(
        (key) => this.param[key as keyof Param] === ""
      );

      let target;
      let ele: HTMLInputElement | undefined;
      userKey[0] === "name"
        ? ((target = "이름을"),
          (ele = this.$refs.inputName as HTMLInputElement))
        : userKey[0] === "email"
        ? ((target = "이메일을"),
          (ele = this.$refs.inputEmail as HTMLInputElement))
        : userKey[0] === "password"
        ? ((target = "비밀번호를"),
          (ele = this.$refs.inputPassword as HTMLInputElement))
        : userKey[0] === "passwordRe"
        ? ((target = "비밀번호를"),
          (ele = this.$refs.inputPasswordRe as HTMLInputElement))
        : userKey[0] === "phoneNumber"
        ? ((target = "전화번호를"),
          (ele = this.$refs.inputPhone as HTMLInputElement))
        : null;

      if (target) {
        alert(`${target} 입력해주세요.`);
        return true;
      }
      this.focusInput(ele);
    },
    focusInput(ele?: HTMLInputElement) {
      if (ele instanceof HTMLInputElement) {
        ele.focus();
      }
    },
  },
};
</script>
<style scoped>
.input-wrap {
  margin: 20px 0;
}
.input-group {
  margin: 20px 0;
}
</style>
