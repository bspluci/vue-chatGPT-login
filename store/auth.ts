export const state = () => ({
  token: "",
});

interface State {
  token: string;
}

export const getters = {
  getAuthState(state: State) {
    return state.token;
  },
};

export const mutations = {
  setAuth(state: State, payload: string) {
    state.token = payload;
    (this as any).$cookies.set("token", payload, 0);
  },
};
