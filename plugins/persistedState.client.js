// 새로고침시 store의 state가 초기화 되는걸 방지 (localstorage 방식)
import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  createPersistedState({
    key: "auth",
    storage: window.localStorage,
  })(store);
};

// 새로고침시 store의 state가 초기화 되는걸 방지 (cookie 방식)
// cookie, js-cookie 설치 필요
// import createPersistedState from "vuex-persistedstate";
// import * as Cookies from "js-cookie";
// import cookie from "cookie";

// export default ({ store, req }) => {
//   createPersistedState({
//     key: "auth",
//     storage: {
//       getItem: (key) => {
//         // See https://nuxtjs.org/guide/plugins/#using-process-flags
//         if (process.server) {
//           const parsedCookies = cookie.parse(req.headers.cookie);
//           return parsedCookies[key];
//         } else {
//           return Cookies.get(key);
//         }
//       },
//       // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
//       setItem: (key, value) =>
//         Cookies.set(key, value, { expires: 365, secure: false }),
//       removeItem: (key) => Cookies.remove(key),
//     },
//   })(store);
// };
