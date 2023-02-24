import { Middleware } from "@nuxt/types";

const AuthMiddleware: Middleware = ({ store, route, redirect }) => {
  let filterPage = ["/login", "/logout"];
  if (
    filterPage.includes(route.path) ||
    !store.state.auth.token ||
    store.state.activeTime.firstTime
  ) {
    store.commit("activeTime/setFirstTime", false);
    return;
  }

  const lastActiveTime = store.state.activeTime.lastActiveTime || Date.now();
  const now = Date.now();
  const idleTime = now - lastActiveTime;
  const timeLimite = 60 * 60 * 1000; // 1분

  if (idleTime > timeLimite) {
    redirect("/logout?time=over");
  } else {
    store.commit("activeTime/setLastActiveTime", now);
  }
};

export default AuthMiddleware;
