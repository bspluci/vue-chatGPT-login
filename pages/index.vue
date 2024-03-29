<template>
  <div>
    <div class="wrap">
      <br />
      <Todos />
      <br />
      <nuxt-link to="/info" class="btn btn-success">info</nuxt-link>
      <nuxt-link to="/type" class="btn btn-warning">typescript</nuxt-link>
      <nuxt-link to="/node" class="btn btn-info">nodejs</nuxt-link>
      <nuxt-link to="/chat" class="btn btn-danger">chat</nuxt-link>
      <nuxt-link to="/groupChat" class="btn btn-secondary">socket.io</nuxt-link>
      <br />
      <br />
      <div>
        <p class="title">AI 이미지 생성기</p>
        <div class="img_input">
          <input
            class="form-control"
            type="text"
            v-model="aiText"
            @keyup.enter="getDrawingAi()"
          />
          <button class="btn btn-secondary" @click="getDrawingAi()">
            이미지 생성
          </button>
        </div>
        <div class="ai_img_wrap">
          <div
            class="ai_img"
            :style="{ 'background-image': `url(${aiImg})` }"
            v-if="aiImg"
          ></div>
          <div v-else-if="aiLoading">{{ ailoadingText }}</div>
          <div v-else></div>
        </div>
      </div>
      <p class="title">AI 채팅</p>
      <div class="chat_wrap">
        <div class="chat_text" ref="chatText">
          <div
            v-for="(item, idx) in chatMessage"
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
            v-model="myMessage"
            @keyup.enter="getChatAi()"
          /><button class="btn btn-secondary" @click="getChatAi()">전송</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Moment from "moment";
import { Configuration, OpenAIApi } from "openai";

interface Data {
  age: number;
  location: string;
  name?: string;
  aiText: string;
  aiImg: string | undefined;
  aiLoading: boolean;
  ailoadingText: string;
  myMessage: string;
  aiMessage: string;
  chatMessage: { target: string | undefined; message: string | undefined }[];
  apiKeys: any;
}

export default {
  // layout: "dark",
  name: "IndexPage",
  data(): Data {
    return {
      age: 100,
      location: "seoul",
      aiText: "",
      aiImg: "",
      aiLoading: false,
      ailoadingText: "이미지 생성중",
      myMessage: "",
      aiMessage: "",
      chatMessage: [],
      apiKeys: process.env.GPT_KEYS,
    };
  },
  // 페이지 불러오기 전 비동기 실행, pages 컴포넌트에서만 사용가능, this 사용 불가능, 첫번째 파라미터로 context를 받아와 데이터를 사용, 리턴된 값은 자동으로 data(){} 에 머지시킴, async/await 사용가능
  asyncData(context: { [key: string]: any }): { name: string } {
    // console.log(context.store.state.changeStyle.dark); // context 안에서 store에 접근가능
    return { name: "park" };
  },
  mounted() {
    const newDate: string = Moment().format("YYYY-MM-DD HH:mm:ss");
  },
  methods: {
    async getDrawingAi() {
      if (!this.aiText) return alert("생성할 이미지 태그를 입력해주세요.");

      this.aiImg = "";
      this.aiLoading = true;
      let loading = setInterval(() => {
        this.ailoadingText = this.ailoadingText += ".";
      }, 1000);

      let configuration = new Configuration({
        apiKey: this.apiKeys,
      });
      const openai = new OpenAIApi(configuration);
      const response = await openai
        .createImage({
          prompt: this.aiText,
          n: 1,
          size: "1024x1024",
        })
        .then((res) => {
          this.aiImg = res.data.data[0].url;
          clearTimeout(loading);
          this.aiLoading = false;
          this.ailoadingText = "이미지 생성중";
        })
        .catch((error) => {
          clearTimeout(loading);
          this.aiLoading = false;
          this.ailoadingText = "이미지 생성중";

          error == "Error: Request failed with status code 429"
            ? alert("이미지 생성에 실패했습니다. 잠시후 다시 시도해주세요.")
            : (alert("오류!!!"), console.log(error));
          return;
        });
    },
    async getChatAi() {
      if (!this.myMessage) return alert("내용을 입력해주세요.");

      const configuration = new Configuration({
        apiKey: this.apiKeys,
      });
      const openai = new OpenAIApi(configuration);
      const promptMessage: string = this.myMessage;

      this.chatMessage.push({ target: "user", message: this.myMessage });
      this.scrollToBottom();
      this.myMessage = "";

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: promptMessage,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      this.chatMessage.push({
        target: "ai",
        message: response.data.choices[0].text,
      });

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
<style scoped>
.img_input {
  text-align: center;
}
.img_input > .form-control {
  width: auto;
  display: inline-block;
}
.ai_img_wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 350px;
  max-width: 350px;
  max-height: 350px;
  margin: 10px auto;
  border: 1px solid #cdcdcd;
}
.ai_img_wrap > div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.ai_img {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
}
.chat_wrap {
  width: 100%;
  height: 500px;
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #cdcdcd;
}
.chat_text {
  overflow-y: auto;
  width: 100%;
  height: 95%;
  padding-bottom: 15px;
}
.chat_talk {
  width: max-content;
  max-width: 80%;
  margin-bottom: 10px;
  padding: 15px 10px;
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
  height: 30px;
  margin-right: 2%;
  text-align: left;
  box-sizing: border-box;
}
.chat_input > button {
  width: 30%;
  height: 30px;
  margin-left: 2%;
  box-sizing: border-box;
}
</style>
