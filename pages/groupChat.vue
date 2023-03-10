<template>
  <div class="wrap">
    <div>
      <button
        class="sub_title btn btn-info"
        v-b-modal.memberList
        @click="getMemberList"
      >
        회원목록
      </button>
    </div>

    <h2 class="sub_title">채팅</h2>
    <div class="chat_wrap">
      <div class="chat_text" ref="chatText">
        <div
          v-for="(item, idx) in skResiveMessage"
          :key="idx"
          class="chat_talk"
        >
          <div
            class="user_box"
            :class="memberInfo?._id === item.userId ? 'right' : 'left'"
            v-if="item.message"
          >
            <div class="profile_img">
              <img
                ref="profileImg"
                :src="`http://localhost:8080${item.userProfile}`"
                @load="fitImageScreen($event)"
              />
            </div>
            <div class="chat_box">
              <div class="chat_name">
                {{ item.userName }}
              </div>
              <div class="chat_content">{{ item.message }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat_input">
        <input
          class="form-control"
          type="text"
          ref="inputChat"
          v-model="sendMessage"
          @keypress.enter="sendMessageChatRoom()"
        />
        <div class="btn btn-primary" @click="sendMessageChatRoom()">전송</div>
      </div>
    </div>

    <MemberList ref="memberList" />
  </div>
</template>

<script lang="ts">
import MemberList from "@/components/MemberList.vue";
import Util from "@/module/Util";
import { io, Socket } from "socket.io-client";

interface MemberInfo {
  createdAt: string;
  email: string;
  name: string;
  phoneNumber: string;
  profile: string;
  updatedAt: string;
  _id: string;
}

interface Data {
  memberInfo: { [key: string]: string } | null;
  sendMessage: string;
  socket: Socket | null;
  skResiveMessage: string[];
  skContent: string;
}

export default {
  name: "chat",
  components: { MemberList },
  data(): Data {
    return {
      memberInfo: null,
      sendMessage: "",
      socket: null,
      skResiveMessage: [],
      skContent: "하하하",
    };
  },
  mounted() {
    this.memberInfo = this.$store.state.member.memberInfo;

    this.socket = io("http://localhost:8080", {
      withCredentials: true,
    });
    this.socket.on("message", (message: string) => {
      this.skResiveMessage.push(message);
      console.log(this.skResiveMessage);
    });
  },
  methods: {
    async getMemberList() {
      const memberList = this.$refs.memberList as any;
      memberList.getAllMemberList();
    },

    async sendMessageChatRoom() {
      console.log(this.memberInfo);
      const message = {
        userId: this.memberInfo ? this.memberInfo._id : "",
        userName: this.memberInfo ? this.memberInfo.name : "",
        userProfile: this.memberInfo ? this.memberInfo.profile : "",
        message: this.sendMessage,
      };
      if (this.socket) {
        this.socket.emit("message", message);
        this.sendMessage = "";
      }
    },

    async createChatRoom(data: MemberInfo) {
      console.log(data);
    },

    fitImageScreen(event: Event) {
      if (event.target) {
        const profileImg = event.target as HTMLImageElement;
        const wrap = event.target as HTMLElement;
        const profileWrap = wrap.parentNode as HTMLDivElement;

        Util.getImageReSize(profileWrap, profileImg);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sub_title {
  margin-top: 30px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
.chat_wrap {
  position: relative;
  width: 100%;
  margin: 0 auto;
  border: 1px solid #cdcdcd;
  border-radius: 5px;
}
.chat_alert {
  position: absolute;
  top: 45%;
  left: 50%;
  width: max-content;
  transform: translate(-50%, -50%);
  padding: 5px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 20px;
  text-align: center;
}
.chat_text {
  overflow-y: auto;
  width: 100%;
  height: 600px;
  padding: 20px;
}
.chat_talk {
  margin-bottom: 20px;
}
.chat_talk .user_box.right {
  display: flex;
  flex-direction: row-reverse;
}
.chat_talk .user_box.left {
  display: flex;
}
.chat_talk .chat_box {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 10px;
}
.chat_talk .chat_content {
  max-width: 80%;
  padding: 5px 10px;
  border: 1px solid #cdcdcd;
  border-radius: 10px;
  word-break: break-all;
}
.chat_talk .user_box.left .chat_name,
.chat_talk .user_box.left .chat_content {
  margin-right: auto;
}
.chat_talk .user_box.right .chat_name,
.chat_talk .user_box.right .chat_content {
  margin-left: auto;
}
.chat_input {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding: 0 30px;
}
.chat_input > input {
  width: 70%;
  height: 40px;
  margin-right: 2%;
  text-align: left;
  box-sizing: border-box;
}
.chat_input > button {
  width: 30%;
  height: 40px;
  margin-left: 2%;
  box-sizing: border-box;
  line-height: 19px;
}
.profile_img {
  overflow: hidden;
  width: 50px;
  height: 50px;
  margin-top: 5px;
  border-radius: 50%;
}
.profile_img > img {
  width: 100%;
}
</style>
