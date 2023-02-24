<template>
  <div>
    <div class="banner_key">랜덤 배너 키워드: {{ drawingText }}</div>
    <div class="banner">
      <div
        class="banner_img"
        :style="{ 'background-image': `url(${aiImg})` }"
        v-if="aiImg"
      ></div>
      <div class="banner_text" v-else-if="aiLoading">{{ ailoadingText }}</div>
      <div v-else></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Configuration, OpenAIApi } from "openai";

interface Data {
  aiImg: string | undefined;
  aiLoading: boolean;
  ailoadingText: string;
  apiKeys: any;
  drawingText: string;
}

export default {
  name: "member",
  data(): Data {
    return {
      aiImg: "",
      aiLoading: false,
      ailoadingText: "배너 생성중",
      apiKeys: process.env.GPT_KEYS,
      drawingText: "",
    };
  },
  mounted() {
    let getRandomInt = (min: number, max: number) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    };

    let textSnippets1 = [
      "",
      "fog",
      "rain",
      "wind",
      "snow",
      "sunshine",
      "drizzle",
      "typhoon",
    ];
    let textSnippets2 = [
      "",
      "dark",
      "early evening",
      "dawn",
      "evening",
      "morning",
      "afternoon",
    ];
    let textSnippets3 = [
      "sky",
      "sea",
      "forest",
      "lake",
      "mount",
      "fields",
      "Jungle",
      "island",
      "lighthouse",
      "city",
      "countryside",
      "airport",
      "battlefield",
      "cathedrals",
      "temples",
    ];

    this.drawingText = `${
      textSnippets1[getRandomInt(0, textSnippets1.length)]
    } ${textSnippets2[getRandomInt(0, textSnippets2.length)]} ${
      textSnippets3[getRandomInt(0, textSnippets3.length)]
    }`;

    // this.getDrawingAi(this.drawingText);
  },
  computed: {},
  watch: {},
  methods: {
    async getDrawingAi(drawingText: string) {
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
          prompt: drawingText,
          n: 1,
          size: "256x256",
        })
        .then((res) => {
          this.aiImg = res.data.data[0].url;
          clearTimeout(loading);
          this.aiLoading = false;
          this.ailoadingText = "배너 생성중";
        })
        .catch((error) => {
          clearTimeout(loading);
          this.aiLoading = false;
          this.ailoadingText = "배너 생성중";

          error.message == "Request failed with status code 429"
            ? alert("배너 생성에 실패했습니다. 잠시후 다시 시도해주세요.")
            : error.message === "Request failed with status code 400"
            ? alert("사용한도를 초과했습니다.")
            : (alert("오류!!!"), console.log(error));
        });
    },
  },
};
</script>

<style scoped>
.banner {
  border: 2px solid #cdcdcd;
}
.banner_key {
  font-size: 16px;
  text-align: center;
}
.banner > .banner_img {
  display: block;
  width: 100%;
  height: 600px;
  background-size: cover;
  background-position: center bottom;
}
.banner > .banner_text {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 600px;
}

@media screen and (max-width: 640px) {
  .banner > .banner_img {
    height: 400px;
    background-position: center center;
  }
  .banner > .banner_text {
    height: 400px;
  }
}
</style>
