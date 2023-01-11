<template>
  <div>
    <div
      class="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">
              오늘의 할일
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref="btnClose"
              @click="closeModal()"
            ></button>
          </div>
          <div v-if="showDivi">
            <div class="modal-body">
              <div>{{ selectData.title }}</div>
              <div>{{ selectData.date }}</div>
            </div>
          </div>
          <div v-else>
            <div class="modal-body">
              <div><input type="text" v-model="editData.title" /></div>
              <div><input type="text" v-model="editData.date" /></div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              v-if="showDivi"
              @click="editTodo()"
            >
              Edit
            </button>
            <button
              type="button"
              class="btn btn-success"
              v-else
              @click="updateTodo()"
            >
              Save
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="closeModal()"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Util from "@/module/Util";

interface SelectItem {
  date: string;
  title: string;
  id: number;
}

interface Data {
  selectData: SelectItem;
  editData: {
    date: string;
    title: string;
    id: number;
  };
  showDivi: boolean;
}

export default {
  name: "listDetail",
  props: {
    selectItem: {
      type: Object as () => SelectItem,
      required: true,
    },
  },
  data(): Data {
    return {
      selectData: {
        date: "",
        title: "",
        id: 0,
      },
      editData: {
        date: "",
        title: "",
        id: 0,
      },
      showDivi: true,
    };
  },
  async mounted() {},
  watch: {
    async selectItem(val: SelectItem) {
      if (!val.id) return;

      this.selectData = val;

      let url = "http://localhost:8080/api/todo/list/detail";
      let params = {
        id: this.selectData?.id,
      };
      await Util.get({ self: this, url, params });
    },
  },
  methods: {
    editTodo() {
      this.editData.title = this.selectData.title;
      this.editData.date = this.selectData.date;
      this.showDivi = false;
    },
    async updateTodo() {
      if (!this.editData.title) return alert("할일을 입력해주세요.");
      if (!this.editData.date) return alert("날짜를 입력해주세요.");
      this.editData.id = this.selectData.id;

      await Util.post({
        self: this,
        url: `http://localhost:8080/api/todo/list/update`,
        params: this.editData,
      })
        .then((res: { [key: string]: any }) => {
          this.editData.title = "";
          this.editData.date = "";
          alert(res.data.message);

          this.closeModal();
          this.$refs.btnClose instanceof HTMLButtonElement
            ? this.$refs.btnClose.click()
            : null;
          (this.$parent as any).loadTodo();
        })
        .catch((err) => {
          return console.log(err);
        });
    },
    closeModal() {
      setTimeout(() => {
        (this.$parent as any).selectItem = {};
        this.showDivi = true;
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped></style>
