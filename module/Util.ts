import { Store } from "vuex";
import { RootState } from "@/store/auth";

interface Params {
  self: Vue;
  url: string;
  params?: { [key: string]: any };
  header?: { [key: string]: string };
  divi?: string;
  isFile?: boolean;
}

interface Headers {
  "Content-Type": string;
  "Access-Control-Allow-Origin": string;
  "Access-Control-Allow-Methods": string;
  "X-AUTH-TOKEN"?: string;
  _id?: string;
}

export default class Util {
  static async post(params: Params) {
    return this.getOrPost({ ...params, ...{ divi: "post" } });
  }

  static async get(params: Params) {
    return this.getOrPost({ ...params, ...{ divi: "get" } });
  }

  static async getOrPost({
    self,
    url,
    params,
    header,
    divi,
    isFile,
  }: Params): Promise<any> {
    try {
      let headers: Headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, GET, POST",
      };
      let authToken = { "X-AUTH-TOKEN": self.$store.state.auth.token };

      headers._id = self.$store.state.member?.memberInfo?._id;
      isFile ? (headers["Content-Type"] = "multipart/form-data") : null;
      header ? (headers = { ...header, ...headers }) : null;
      authToken ? (headers = { ...headers, ...authToken }) : null;

      return divi === "post"
        ? await self.$axios.post(url, params, { headers })
        : divi === "get"
        ? await self.$axios.get(url, { params, headers })
        : null;
    } catch (err: any) {
      console.error(err.message);
      throw err;
    }
  }

  static async logout(self: Vue) {
    let store: Store<RootState> = self.$store;

    store.commit("auth/setAuth", null);
    store.commit("member/setMemberInfo", null);
    self.$cookies.removeAll();
  }

  static getImageReSize(
    profileWrap: HTMLDivElement,
    profileImg: HTMLImageElement
  ) {
    profileWrap.style.display = "flex";
    profileWrap.style.justifyContent = "center";
    profileWrap.style.alignItems = "center";

    if (profileWrap && profileImg) {
      let wrapWidth = profileWrap.clientWidth;
      let wrapHeight = profileWrap.clientHeight;
      let imgWidth = profileImg.width;
      let imgHeight = profileImg.height;

      if (wrapWidth > imgWidth) {
        profileImg.style.width = "100%";
        profileImg.style.height = "auto";
      } else if (wrapHeight > imgHeight) {
        profileImg.style.width = "auto";
        profileImg.style.height = "100%";
      }
    }
  }

  static getByteLength(str: string): number {
    let byteLength = 0;
    for (let i = 0; i < str.length; i++) {
      let charCode = str.charCodeAt(i);
      if (charCode <= 127) {
        // 영문자일 경우
        byteLength++;
      } else if (charCode <= 0x7ff) {
        // 한글이 아닌 2바이트 문자일 경우
        byteLength += 2;
      } else if (charCode <= 0xffff) {
        // 한글일 경우
        byteLength += 3;
      } else {
        // 이 외의 경우(예: 이모지)
        byteLength += 4;
      }
    }
    return byteLength;
  }
}
