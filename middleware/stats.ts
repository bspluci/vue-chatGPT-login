import { Context } from "@nuxt/types";

export default function (context: Context) {
  console.log(context);
  context.store.state.member.memberInfo
    ? context.app.$cookies.set(
        "memberSeq",
        context.store.state.member.memberInfo.memberSeq
      )
    : console.log("logout!");
}
