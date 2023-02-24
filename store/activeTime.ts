export interface RootState {
  firstTime: boolean;
  lastActiveTime: number | null;
}

export const state = () => ({
  firstTime: false,
  lastActiveTime: Date.now(),
});

export const mutations = {
  setFirstTime(state: any, payload: boolean) {
    state.firstTime = payload;
  },

  setLastActiveTime(state: any, payload: number) {
    state.lastActiveTime = payload;
  },

  resetStore(state: any) {
    Object.assign(
      state,
      ((state.lastActiveTime = null), (state.firstTime = true))
    );
  },
};
