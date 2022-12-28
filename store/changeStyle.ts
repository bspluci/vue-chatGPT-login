export const state = () => ({
  dark: false,
});

export const mutations = {
  changeStyle(state: { dark: boolean }, payload: boolean) {
    state.dark = !state.dark;
  },
};
