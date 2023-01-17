export const state = () => ({
  memberInfo: null,
});

interface Info {
  [key: string]: any;
}

export const getters = {
  getMemberInfo(state: Info) {
    return state.token;
  },
};

export const mutations = {
  setMemberInfo(state: Info, payload: Info) {
    state.memberInfo = payload;
  },
};
