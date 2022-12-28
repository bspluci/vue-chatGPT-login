// axios 통신 결과값을 사용자에게 보내기 전 개발가능
export default function ({ $axios, redirect }) {
  $axios.onRequest((config) => {
    // console.log(config.url);
  });

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status);

    if (code === 404) {
      redirect("/404");
    } else if (code === 500) {
      $nuxt.error({
        statusCode: error.response.status,
      });
    } else {
      alert(`ERROR : ${error.message}`);
    }
  });
}
