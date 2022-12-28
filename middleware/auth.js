export default function ({ store, redirect, route, $cookies }) {
  let pathFilter = ["/", "/login"];
  let pathCheck = pathFilter.includes(route.path);

  if (!pathCheck && !$cookies.get("auth")) {
    pathFilter.push("/404");
    if (!pathFilter.includes(route.path)) {
      alert("로그인이 필요한 페이지 입니다.");
    }
    return redirect("/login");
  }
}
