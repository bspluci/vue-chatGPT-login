interface Member {
  createdAt: string;
  email: string;
  name: string;
  phoneNumber: string;
  profile: string;
  updateAt: string;
  receiveMsg: boolean;
}

interface State<T> {
  memberInfo: T;
}

export const state = () => ({
  memberInfo: null,
});

export const getters = {
  getMemberInfo(state: State<Member>) {
    return state.memberInfo;
  },
};

export const mutations = {
  setMemberInfo(state: State<Member>, payload: Member) {
    state.memberInfo = payload;
  },
};
