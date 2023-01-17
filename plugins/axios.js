// axios 통신 결과값을 사용자에게 보내기 전 개발가능
export default function ({ $axios, redirect }) {
  $axios.onRequest((config) => {
    // console.log(config.url);
  });

  $axios.onError((error) => {
    const status = error.response.data.status;
    const code = parseInt(error.response.data.code || error.response.status);

    status === "Token Expired Error" || status === "JsonWeb Token Error"
      ? (redirect("/logout"), alert(error.response.data.message))
      : alert(error.response.data.message);
  });
}
