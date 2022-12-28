export default function (context) {
  context.store.state.memberInfo.memberInfo
    ? context.app.$cookies.set(
        "memberSeq",
        context.store.state.memberInfo.memberInfo.memberSeq
      )
    : console.log("logout!");
}
