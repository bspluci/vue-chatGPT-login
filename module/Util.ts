let TOKEN = "";
interface Post {
  self: any;
  url: string;
  params?: { [key: string]: any };
  header?: { [key: string]: string };
}

export default class Util {
  public static async post({ self, url, params, header }: Post): Promise<any> {
    try {
      let headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, GET, POST",
      };

      let authToken = { "X-AUTH-TOKEN": self.$store.state.auth.token };

      header ? (headers = { ...header, ...headers }) : null;
      authToken ? (headers = { ...headers, ...authToken }) : null;

      let res = await self.$axios.post(url, params, { headers });

      return res;
    } catch (e: any) {
      if (e.code === "ERR_BAD_REQUEST") {
        // self.$router.push("/login");
        return e.response;
      }
    }
  }

  public static async get({ self, url, params, header }: Post): Promise<any> {
    try {
      let headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, GET, POST",
      };

      let authToken = { "X-AUTH-TOKEN": self.$store.state.auth.token };
      headers = { ...headers, ...authToken };
      header ? (headers = { ...header, ...headers }) : null;

      let res = await self.$axios.get(url, { params, headers });

      return res.data;
    } catch (e: any) {
      if (e.code === "ERR_BAD_REQUEST") {
        // self.$router.push("/login");
        return e.response;
      }
    }
  }

  public static async logout(self: any) {
    self.setAuth("");
    self.setMemberInfo(null);
    (self as any).$cookies.removeAll();
  }
}
