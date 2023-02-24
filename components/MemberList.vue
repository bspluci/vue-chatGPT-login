<template>
  <div>
    <b-modal
      class="modal fade"
      id="memberList"
      title="회원목록"
      hide-footer
      scrollable
      centered
    >
      <div class="modal-body">
        <ul>
          <li class="profile_list" v-for="(item, idx) in memberlist" :key="idx">
            <div class="profile_inner">
              <div class="profile_img" ref="profileWrap">
                <img
                  ref="profileImg"
                  :src="`http://localhost:8080${item.profile}`"
                  @load="fitImageScreen($event)"
                />
              </div>

              <div class="profile_text">
                <p>name: {{ item.name }}</p>
                <p>email: {{ item.email }}</p>
              </div>
            </div>
            <div class="profile_btn">
              <button class="btn btn-success" @click="chatStart(item)">
                채팅하기
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div class="modal-footer">
        <b-button
          type="button"
          class="btn btn-secondary"
          data-bs-dismiss="modal"
          @click="$bvModal.hide('memberList')"
        >
          Close
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Util from "../module/Util";

interface MemberInfo {
  createdAt: string;
  email: string;
  name: string;
  phoneNumber: string;
  profile: string;
  updatedAt: string;
  _id: string;
}

interface Data {
  userId: string;
  memberlist: MemberInfo[];
}

export default {
  name: "listDetail",
  data(): Data {
    return {
      userId: "",
      memberlist: [],
    };
  },
  async mounted() {
    this.userId = this.$store.state.member.memberInfo._id;
    this.getAllMemberList();
  },
  methods: {
    async getAllMemberList() {
      let url = "/api/member/allMemberList";
      let params = {
        condition: "ALL",
        _id: this.userId,
      };

      await Util.post({ self: this, url, params })
        .then((res) => {
          if (res.status === 200) {
            this.memberlist = res.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fitImageScreen(event: Event) {
      if (event.target) {
        const profileImg = event.target as HTMLImageElement;
        const wrap = event.target as HTMLElement;
        const profileWrap = wrap.parentNode as HTMLDivElement;

        Util.getImageReSize(profileWrap, profileImg);
      }
    },

    async chatStart(item: MemberInfo) {
      interface Params {
        _id: string;
      }

      let url = "/api/chat/startUserChat";
      let params: Params = {
        _id: item._id,
      };

      await Util.post({ self: this, url, params })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      this.$bvModal.hide("memberList");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-body {
  padding-top: 0;
  padding-bottom: 0;
}
.profile_list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #cdcdcd;
  padding: 20px;
}
.profile_list:last-child {
  border-bottom: none;
}
.profile_inner {
  display: flex;
  align-items: center;
}
.profile_img {
  overflow: hidden;
  width: 60px;
  height: 60px;
  margin-right: 20px;
  border-radius: 50%;
}
.profile_btn {
  min-width: 85px;
}
.profile_img > img {
  width: 100%;
}
.modal-body {
  padding: 0;
}
</style>
