export const state = () => ({
  memberInfo: null,
});

interface Info {
  [key: string]: any;
}
export const mutations = {
  setMemberInfo(state: Info, payload: Info) {
    state.memberInfo = payload;
  },
  delMemberInfo(state: Info, payload: Info) {
    state.memberInfo = payload;
  },
};
