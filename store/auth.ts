export const state = () => ({
  auth: "",
});

interface State {
  auth: string;
}

export const getters = {
  getAuthState(state: State) {
    return state.auth;
  },
};

export const mutations = {
  setAuth(state: State, payload: string) {
    state.auth = payload;

    payload
      ? (this as any).$cookies.set("auth", payload)
      : (this as any).$cookies.removeAll();
  },
};
