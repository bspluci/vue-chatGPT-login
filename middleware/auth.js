export default function ({ store, redirect, route, $cookies }) {
  let pathFilter = ["/", "/login", "/register"];
  let pathCheck = pathFilter.includes(route.path);

  if (!pathCheck && !$cookies.get("token")) {
    pathFilter.push("/404");
    if (!pathFilter.includes(route.path)) {
      let self = { store: store };
      alert("로그인이 필요한 페이지 입니다.");
    }
    return redirect("/login");
  }
}
