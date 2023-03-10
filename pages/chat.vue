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
      <div v-if="chatRdy" class="chat_alert">{{ chatAlert }}</div>
      <div class="chat_text" ref="chatText">
        <div
          v-for="(item, idx) in chatContent.chatMessage"
          :key="idx"
          class="chat_talk"
        >
          <div
            class="user_box"
            :class="memberInfo?._id === item.chatId ? 'right' : 'left'"
            v-if="item.message"
          >
            <div class="profile_img">
              <img
                ref="profileImg"
                :src="`http://localhost:8080${
                  chatContent.userId === item.chatId
                    ? chatContent.userProfile
                    : chatContent.targetProfile
                }`"
                @load="fitImageScreen($event)"
              />
            </div>
            <div class="chat_box">
              <div class="chat_name">
                {{
                  chatContent.userId === item.chatId
                    ? chatContent.userName
                    : chatContent.targetName
                }}
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

interface ChatContent {
  chatMessage: {
    chatId: string;
    message: string;
  }[];
  createdAt: string;
  targetId: string;
  targetName: string;
  targetProfile: string;
  updatedAt: string;
  userId: string;
  userName: string;
  userProfile: string;
  _id?: string;
}

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
  chatRdy: boolean;
  chatAlert: string;
  sendMessage: string;
  chatContent: ChatContent;
  eventSource: EventSource | null;
  socket?: Socket;
  receivedMessage: [];
}

export default {
  name: "chat",
  components: { MemberList },
  data(): Data {
    return {
      memberInfo: null,
      chatRdy: false,
      chatAlert: "",
      sendMessage: "",
      chatContent: {
        chatMessage: [
          {
            chatId: "",
            message: "",
          },
        ],
        createdAt: "",
        targetId: "",
        targetName: "",
        targetProfile: "",
        updatedAt: "",
        userId: "",
        userName: "",
        userProfile: "",
        _id: "",
      },
      eventSource: null,
      socket: undefined,
      receivedMessage: [],
    };
  },
  mounted() {
    this.memberInfo = this.$store.state.member.memberInfo;

    this.socket = io("http://localhost:8080");
    this.socket.on("connect", () => {
      // 여기서 소켓이 생성되고 반환될 때에 코드를 적는다.
    });

    this.socket.on("messages", (messages: any) => {
      console.log(messages);
      // 커스텀 이벤트
      this.receivedMessage = messages;
    });
  },
  methods: {
    async getMemberList() {
      const memberList = this.$refs.memberList as any;
      memberList.getAllMemberList();
    },

    async createChatRoom(item: MemberInfo) {
      if (this.eventSource !== null) {
        this.eventSource.close();
      }

      this.sendMessage = "";
      let url = "/api/chat/startUserChat";
      let params: { _id: string } = {
        _id: item._id,
      };

      await Util.post({ self: this, url, params })
        .then((res) => {
          this.chatContent = res.data.data;
          this.chatRdy = false;
          this.scrollToBottom();
        })
        .catch((err) => {
          console.log(err);
        });

      this.eventSource = new EventSource(
        `http://localhost:8080/api/chat/message?id=${this.chatContent._id}`
      );
      this.eventSource.addEventListener("message", (e) => {
        const data = JSON.parse(e.data);
        this.chatContent.chatMessage = data.chatMessage;
        this.scrollToBottom();
      });
    },

    async sendMessageChatRoom() {
      interface Params {
        myId: string | undefined;
        roomId?: string;
        userId: string;
        targetId: string;
        chatMessage: {
          message: string;
        };
      }

      this.chatRdy = false;
      if (this.chatContent._id === "")
        return this.showChatAlert("채팅 대상을 선택해주세요.");
      if (this.sendMessage === "")
        return this.showChatAlert("메세지를 입력해주세요.");

      const url = "/api/chat/updateChatMessage";
      const params: Params = {
        myId: this.memberInfo?._id,
        roomId: this.chatContent._id,
        userId: this.chatContent.userId,
        targetId: this.chatContent.targetId,
        chatMessage: {
          message: this.sendMessage,
        },
      };
      await Util.post({ self: this, url, params })
        .then((res) => {
          const result: ChatContent = res.data.data;

          // this.chatContent.chatMessage = result.chatMessage;
          this.sendMessage = "";
          this.scrollToBottom();
        })
        .catch((err) => {
          console.log(err);
        });

      if (this.$refs.inputChat instanceof HTMLInputElement) {
        this.$refs.inputChat.focus();
      }
    },

    fitImageScreen(event: Event) {
      if (event.target) {
        const profileImg = event.target as HTMLImageElement;
        const wrap = event.target as HTMLElement;
        const profileWrap = wrap.parentNode as HTMLDivElement;

        Util.getImageReSize(profileWrap, profileImg);
      }
    },

    scrollToBottom() {
      setTimeout(() => {
        let target = this.$refs.chatText;
        if (target instanceof HTMLDivElement) {
          target.scrollTop = target.scrollHeight;
        }
      }, 10);
    },

    showChatAlert(message: string) {
      this.chatAlert = message;
      this.chatRdy = true;

      setTimeout(() => {
        this.chatRdy = false;
      }, 3000);
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
