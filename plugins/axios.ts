import { Context } from "@nuxt/types";

// axios 통신 결과값을 사용자에게 보내기 전 개발가능
export default function ({ $axios, redirect }: Context) {
  $axios.onRequest((config) => {});

  $axios.onError((error: any) => {
    const status = error.response?.data?.status || error.message;

    status === "Token Expired Error" || status === "JsonWeb Token Error"
      ? (redirect("/logout"), alert(error.response.data.message))
      : alert(error.message);
  });
}
