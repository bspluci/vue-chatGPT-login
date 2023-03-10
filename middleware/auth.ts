import { Context } from "@nuxt/types";

export default function ({ store, redirect, route, $cookies }: Context) {
  const pathFilter = ["/", "/logout", "/login", "/register"];
  const pathCheck = pathFilter.includes(route.path);

  if (!pathCheck && !$cookies.get("token")) {
    pathFilter.push("/404");

    if (!pathFilter.includes(route.path)) {
      store.state.auth.token = null;
      store.state.member.memberInfo = null;
      $cookies.removeAll();

      process.client
        ? alert("로그인이 필요한 페이지 입니다.")
        : console.log("로그인이 필요한 페이지 입니다.");
    }
    return redirect("/login");
  }
}
