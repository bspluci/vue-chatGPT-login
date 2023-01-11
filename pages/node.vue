<template>
  <div>
    <div>
      <button @click="loadHtml('nav')">load to nav</button>
      <button @click="loadHtml('slider')">load to slider</button>
    </div>
    <div>
      <div ref="nav"></div>
      <div ref="slider"></div>
    </div>
    <br />
    <br />

    <div>
      <div class="form-group">
        <label>오늘의 할일</label>
        <input
          type="text"
          class="form-control"
          name="title"
          v-model="todoParam.title"
          @keypress.enter="saveTodo()"
          ref="title"
        />
      </div>
      <div class="form-group">
        <label>날짜</label>
        <input
          type="text"
          class="form-control"
          name="date"
          v-model="todoParam.date"
          @keypress.enter="saveTodo()"
        />
      </div>
      <br />
      <div style="text-align: center">
        <button type="submit" class="btn btn-primary" @click="saveTodo()">
          등록
        </button>
      </div>
    </div>
    <br />
    <br />

    <div>
      <h2 style="font-size: 20px; font-weight: bold; text-align: center">
        오늘의 할일 목록
      </h2>
      <ul class="list-group">
        <li v-for="(item, idx) in todoList" :key="idx" class="list-group-item">
          <div
            @click="showModal(item)"
            :class="item.completed ? 'completed' : ''"
            style="cursor: pointer"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            {{ item.title }} <span>{{ item.date }}</span>
          </div>
          <button
            class="btn btn-success"
            style="
              --bs-btn-padding-y: 0.25rem;
              --bs-btn-padding-x: 0.5rem;
              --bs-btn-font-size: 0.75rem;
              margin-left: 10px;
            "
            @click="completedTodo(item)"
            v-if="!item.completed"
          >
            완료
          </button>
          <button
            class="btn btn-secondary"
            style="
              --bs-btn-padding-y: 0.25rem;
              --bs-btn-padding-x: 0.5rem;
              --bs-btn-font-size: 0.75rem;
              margin-left: 10px;
            "
            @click="completedTodo(item)"
            v-else
          >
            취소
          </button>
          <button
            class="btn btn-danger"
            style="
              --bs-btn-padding-y: 0.25rem;
              --bs-btn-padding-x: 0.5rem;
              --bs-btn-font-size: 0.75rem;
              margin: 0 10px;
            "
            @click="deleteTodo(item.id)"
          >
            삭제
          </button>
        </li>
      </ul>
    </div>

    <div class="list_detail"><Detail :selectItem="selectItem" /></div>
  </div>
</template>

<script lang="ts">
import Detail from "@/components/detail.vue";
import Util from "@/module/Util";

interface ListItem {
  date: string;
  title: string;
  id: number;
  completed: boolean;
}

export default {
  name: "nodeTest",
  components: { Detail },
  data() {
    return {
      baseUrl: "http://localhost:8080",
      todoParam: {
        date: "",
        title: "",
      },
      todoList: [{}],
      selectItem: {},
    };
  },
  async mounted() {
    this.loadTodo();
  },
  methods: {
    async loadHtml(target: string) {
      const res = await Util.get({
        self: this,
        url: `${this.baseUrl}/html/${target}`,
      });

      target === "nav" && this.$refs.nav instanceof HTMLDivElement
        ? (this.$refs.nav.innerHTML = res)
        : target === "slider" && this.$refs.slider instanceof HTMLDivElement
        ? (this.$refs.slider.innerHTML = res)
        : null;
    },
    async loadTodo() {
      const res: { data: { [key: string]: string }[] } = await Util.get({
        self: this,
        url: `${this.baseUrl}/api/todo/list`,
      });

      this.todoList = res.data;
    },
    async saveTodo() {
      if (!this.todoParam.title) return alert("할일을 입력해주세요.");
      if (!this.todoParam.date) return alert("날짜를 입력해주세요.");

      await Util.post({
        self: this,
        url: `${this.baseUrl}/api/todo/create`,
        params: this.todoParam,
      })
        .then((res: { [key: string]: any }) => {
          this.todoParam.title = "";
          this.todoParam.date = "";

          alert(res.data.message);

          this.loadTodo();
          this.$refs.title instanceof HTMLInputElement
            ? this.$refs.title.focus()
            : null;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async deleteTodo(id: number) {
      let condition: any = confirm("정말 삭제하시겠습니까?");
      if (!condition) return;

      let url = `${this.baseUrl}/api/todo/list/delete`;
      let params = { id };

      await Util.post({ self: this, url, params })
        .then((res: { [key: string]: any }) => {
          alert(res.data.message);
        })
        .catch((err) => {
          console.log(err);
        });

      this.loadTodo();
    },
    async completedTodo(item: ListItem) {
      let url = `${this.baseUrl}/api/todo/list/update`;
      let params = { id: item.id, completed: !item.completed };

      await Util.post({ self: this, url, params })
        .then((res: { [key: string]: any }) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      this.loadTodo();
    },
    showModal(item: ListItem) {
      this.selectItem = item;
    },
  },
};
</script>

<style lang="scss" scoped>
.list-group-item {
  display: flex;
  align-items: center;
}
.list-group-item > .completed {
  text-decoration: line-through;
}
</style>
