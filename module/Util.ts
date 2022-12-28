interface Post {
  self: any;
  url: string;
  param: { [key: string]: string };
  header?: { [key: string]: string };
}

export default class Util {
  public static async post({ self, url, param, header }: Post): Promise<any> {
    try {
      let axiosHeaders = {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, GET, POST",
      };

      header ? (axiosHeaders = { ...header, ...axiosHeaders }) : null;

      let res = await self.$axios.post(url, param, { headers: axiosHeaders });

      return res;
    } catch (e: any) {
      if (e.code === "ERR_BAD_REQUEST") {
        self.$router.push("/login");
        return e.response;
      }
    }
  }

  public static get() {}
}
