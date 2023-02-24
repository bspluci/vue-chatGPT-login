<template>
  <div class="wrap">
    <div>
      <button class="sub_title btn btn-info" v-b-modal.memberList>
        회원목록
      </button>
    </div>

    <h2 class="sub_title">채팅</h2>
    <div class="chat_wrap">
      <div v-if="chatAlert" class="chat_alert">{{ chatAlert }}</div>
      <div class="chat_text" ref="chatText">
        <div
          v-for="(item, idx) in messageList"
          :key="idx"
          :class="`chat_talk chat_${item.target}`"
        >
          {{ item.message }}
        </div>
      </div>
      <div class="chat_input">
        <input
          class="form-control"
          type="text"
          ref="inputChat"
          v-model="chatMessage"
          @keyup.enter="sendMessage()"
        />
        <button class="btn btn-primary" @click="sendMessage()">전송</button>
      </div>
    </div>

    <MemberList />
  </div>
</template>

<script lang="ts">
import MemberList from "@/components/MemberList.vue";

interface Data {
  userId: string;
  chatAlert: string;
  chatMessage: string;
  messageList: {
    target: string;
    message: string;
  }[];
}

export default {
  name: "chat",
  components: { MemberList },
  data(): Data {
    return {
      userId: "",
      chatAlert: "채팅 대상을 선택해주세요.",
      chatMessage: "",
      messageList: [],
    };
  },
  async mounted() {},
  methods: {
    async sendMessage() {
      this.messageList.push({ message: this.chatMessage, target: "user" });
      this.chatMessage = "";

      if (this.$refs.inputChat instanceof HTMLDivElement) {
        this.$refs.inputChat.focus();
      }

      this.scrollToBottom();
    },

    scrollToBottom() {
      setTimeout(() => {
        let target = this.$refs.chatText;

        if (target instanceof HTMLDivElement) {
          target.scrollTop = target.scrollHeight;
        }
      }, 10);
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
  padding: 20px;
  border: 1px solid #cdcdcd;
  border-radius: 5px;
}
.chat_alert {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
}
.chat_text {
  overflow-y: auto;
  width: 100%;
  height: 100%;
  min-height: 600px;
  padding-bottom: 15px;
}
.chat_talk {
  width: max-content;
  max-width: 80%;
  margin-bottom: 10px;
  padding: 5px 10px;
  border: 1px solid #cdcdcd;
  border-radius: 10px;
}
.chat_talk.chat_ai {
  margin-right: auto;
  word-break: break-all;
}
.chat_talk.chat_user {
  margin-left: auto;
}
.chat_input {
  display: flex;
  text-align: center;
  margin-bottom: 20px;
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
</style>
