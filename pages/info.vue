<template>
  <div class="wrap">
    <h1 class="title">회원정보를 확인하세요</h1>
    <div class="member_info">
      <div>
        <b-container fluid>
          <b-row class="my-1">
            <b-col sm="3">
              <label for="input-invalid" class="text-bold">name</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                id="input-invalid"
                ref="inputName"
                v-model="param.name"
                :state="nameValid"
                placeholder="이름을 입력해주세요.(최대 12자리)"
                @input="nameValidation()"
                @keyup="nameValidation()"
              ></b-form-input>
            </b-col>
          </b-row>
        </b-container>

        <b-container fluid>
          <b-row class="my-1">
            <b-col sm="3">
              <label for="input-invalid" class="text-bold">email</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                id="input-invalid"
                ref="inputEmail"
                v-model="param.email"
                :state="emailValid"
                placeholder="이메일을 입력해주세요."
                @input="emailValidation()"
                @keyup="emailValidation()"
              ></b-form-input>
            </b-col>
          </b-row>
        </b-container>

        <b-container fluid>
          <b-row class="my-1">
            <b-col sm="3">
              <label for="input-invalid" class="text-bold">phone</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                id="input-invalid"
                ref="inputPhone"
                v-model="param.phoneNumber"
                :state="phoneValid"
                placeholder="전화번호를 입력해주세요."
                @input="[phoneValidation(), phoneReplace()]"
                @keyup="[phoneValidation(), phoneReplace()]"
              ></b-form-input>
            </b-col>
          </b-row>
        </b-container>

        <b-container fluid>
          <b-row class="my-1 receive-msg">
            <b-col sm="3">
              <label for="input-invalid" class="text-bold">채팅수신</label>
            </b-col>
            <b-col sm="9">
              <b-form-checkbox
                v-model="param.receiveMsg"
                name="check-button"
                switch
              >
              </b-form-checkbox>
            </b-col>
          </b-row>
        </b-container>

        <b-container fluid>
          <b-row class="my-1">
            <b-col sm="3">
              <label for="input-invalid" class="text-bold">token</label>
            </b-col>
            <b-col class="token" sm="9">
              <span>{{ token }}</span>
            </b-col>
          </b-row>
        </b-container>
      </div>

      <div>
        <b-col sm="3">
          <label for="input-invalid" class="text-bold"
            >프로필 이미지 변경</label
          >
        </b-col>
        <b-col class="profile-content" sm="9">
          <div class="profile_imagewrap" ref="profileWrap">
            <img
              v-if="previewUrl"
              ref="profileImg"
              :src="previewUrl"
              @load="fitImageScreen"
            />
            <img
              v-else
              ref="profileImg"
              :src="`http://localhost:8080${profileUrl}`"
              @load="fitImageScreen"
            />
          </div>
          <b-form-file
            v-model="profileImage"
            :state="Boolean(profileImage)"
            placeholder="파일을 드래그하거나 선택해주세요."
            drop-placeholder="파일을 드롭해주세요."
            @change="onFileInputChange($event)"
          ></b-form-file>
        </b-col>
      </div>
    </div>
    <br />

    <div class="text-right">
      <button class="btn btn-warning" @click="$router.go(-1)">뒤로가기</button>
      <button class="btn btn-success" @click="editMemberProfile()">저장</button>
    </div>
  </div>
</template>

<script lang="ts">
import Util from "../module/Util";
import { mapMutations } from "vuex";

interface Res {
  [key: string]: any;
}

interface Data {
  token: number | string;
  param: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    receiveMsg: boolean;
  };
  nameValid: boolean | null;
  emailValid: boolean | null;
  phoneValid: boolean | null;
  originalProfileImage: any;
  profileImage: any;
  profileUrl: string;
  previewUrl: string | null;
  previewFile: File | null;
}

export default {
  name: "info",
  asyncData(context: { [key: string]: any }) {},
  data(): Data {
    return {
      token: "",
      nameValid: null,
      emailValid: null,
      phoneValid: null,
      param: {
        _id: "",
        name: "",
        email: "",
        phoneNumber: "",
        receiveMsg: false,
      },
      originalProfileImage: null,
      profileImage: null,
      profileUrl: "",

      previewUrl: null,
      previewFile: null,
    };
  },
  mounted() {
    this.showMemberToken();
    this.getMemberInfo();
    this.nameValidation();
    this.emailValidation();
    this.phoneValidation();
    this.profileUrl = this.$store.state.member.memberInfo?.profile;
  },
  methods: {
    ...mapMutations("member", {
      setMemberInfo: "setMemberInfo",
    }),

    getMemberInfo() {
      let memberInfo = this.$store.state.member.memberInfo;

      if (memberInfo !== null) {
        this.param._id = memberInfo._id;
        this.param.name = memberInfo.name;
        this.param.email = memberInfo.email;
        this.param.phoneNumber = memberInfo.phoneNumber;
        this.param.receiveMsg = memberInfo.receiveMsg;
      }
    },

    showMemberToken() {
      this.token = this.$cookies.get("token");
    },

    fitImageScreen() {
      let profileWrap = this.$refs.profileWrap as HTMLDivElement;
      let profileImg = this.$refs.profileImg as HTMLImageElement;

      Util.getImageReSize(profileWrap, profileImg);
    },

    onFileInputChange(event: Event) {
      const input = event.target as HTMLInputElement;
      const files = input.files;
      if (files && files.length > 0) {
        this.previewFile = files[0];
        this.previewImage();
      }
    },

    previewImage() {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.previewFile as File);
    },

    async editMemberProfile() {
      let msg = "";
      let ele: HTMLInputElement | undefined;

      if (!this.nameValid) {
        msg = "이름을";
        ele = this.$refs.inputName as HTMLInputElement;
      } else if (!this.emailValid) {
        msg = "이메일을";
        ele = this.$refs.inputEmail as HTMLInputElement;
      } else if (!this.phoneValid) {
        msg = "전화번호를";
        ele = this.$refs.inputPhone as HTMLInputElement;
      }

      if (msg && ele) {
        ele.focus();
        return alert(`${msg} 확인해주세요.`);
      }

      let formData: any = new FormData();
      formData.append("image", this.profileImage!);
      formData.append("_id", this.param._id);
      formData.append("name", this.param.name);
      formData.append("email", this.param.email);
      formData.append("phoneNumber", this.param.phoneNumber);
      formData.append("receiveMsg", this.param.receiveMsg);
      let url = "/api/member/editMemberProfile";
      let params = formData;

      let editMember = await Util.post({
        self: this,
        url,
        params,
        isFile: true,
      });

      if (editMember.data.status === 200) {
        alert("프로필 저장이 완료됐습니다.");

        await Util.post({
          self: this,
          url: "/api/member/userInfo",
          params: this.param,
        }).then((res: Res) => {
          if (res.data.status === 200) {
            this.setMemberInfo(res.data.data);
          }
          this.$router.push("/");
        });
      }
    },

    nameValidation() {
      this.param.name == "" || this.param.name?.length > 12
        ? (this.nameValid = false)
        : (this.nameValid = true);
    },

    emailValidation() {
      let regex = new RegExp(
        "([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])"
      );

      this.param.email
        ? (this.emailValid = regex.test(this.param.email))
        : (this.emailValid = false);
    },

    phoneValidation() {
      let regex = /^(\d{3})-(\d{3,4})-(\d{4})$/;
      this.phoneValid = regex.test(this.param.phoneNumber);
    },

    phoneReplace() {
      this.param.phoneNumber = this.param.phoneNumber
        .replace(/[^0-9]/g, "")
        .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 24px;
  font-weight: bold;
}
.member_info {
  width: 100%;
  padding: 20px;
  border: 1px solid #ddd;
}
.member_info > div {
  word-break: break-all;
  font-size: 18px;
}
.member_info .text-bold {
  font-weight: bold;
}
.member_info .token {
  word-break: keep-all;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: pre;
}
.member_info .row.my-1 {
  border-bottom: 1px solid #ddd;
  padding-top: 5px;
  padding-bottom: 15px;
}
.member_info .profile-content {
  margin: 0 auto;
}
.member_info .profile_imagewrap {
  overflow: hidden;
  width: 100px;
  height: 100px;
  margin: 10px auto;
  padding: 0;
}
.member_info .profile_imagewrap img {
  width: 100%;
}
.member_info .receive-msg {
  display: flex;
  flex-wrap: nowrap;
}
.member_info .receive-msg > div {
  width: max-content;
}
</style>
