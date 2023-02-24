export interface AuthState {
  token: string | null;
}

export interface RootState {
  auth: AuthState;
}

export const state = () => ({
  token: null,
});

export const getters = {
  getAuthState(state: AuthState) {
    return state.token;
  },
};

export const mutations = {
  setAuth(state: AuthState, payload: string | null) {
    state.token = payload;
    (this as any).$cookies.set("token", payload, 0);
  },

  resetStore(state: any) {
    Object.assign(state, (state.auth = null));
  },
};
