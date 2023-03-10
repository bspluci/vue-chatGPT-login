<template>
  <div class="wrap">
    <br />
    <div>
      <button @click="loadHtml('nav')" class="btn btn-warning">
        load to nav
      </button>
      <button @click="loadHtml('slider')" class="btn btn-warning">
        load to slider
      </button>
    </div>
    <div>
      <div ref="nav" class="nav_wrap"></div>
      <br />
      <div ref="slider" class="slider_wrap"></div>
    </div>
    <br />

    <div>
      <div class="form-group">
        <label>오늘의 할일</label>
        <input
          type="text"
          class="form-control"
          name="title"
          v-model="todoParam.title"
          @input="onInput"
          @keypress.enter="saveTodo()"
          ref="title"
        />
        <p style="text-align: right">
          {{ byteLength }} / {{ byteLengthLimite }} byte
        </p>
        <label>날짜</label>
        <input
          type="text"
          class="form-control"
          name="date"
          v-model="todoParam.date"
          @keypress.enter="saveTodo()"
        />
      </div>
      <div style="text-align: center">
        <button type="submit" class="btn btn-primary" @click="saveTodo()">
          등록
        </button>
      </div>
    </div>
    <br />
    <br />

    <div>
      <h2 class="sub_title">오늘의 할일 목록</h2>
      <div>
        <button class="btn btn-light" @click="loadTodo()">목록 초기화</button>
      </div>
      <ul class="list-group">
        <li v-for="(item, idx) in todoList" :key="idx" class="list-group-item">
          <div :class="item.completed ? 'completed' : ''">
            <div>No. {{ item.id }}</div>
            <div @click="selectItem = item" v-b-modal.fixTodo>
              Todo : {{ item.title }}
            </div>
            <div>Date : {{ item.date }}</div>
            <div>Writer : {{ item.user }}</div>
          </div>
          <div style="display: flex">
            <button
              class="btn btn-success todo_btn"
              @click="completedTodo(item)"
              v-if="!item.completed"
            >
              완료
            </button>
            <button
              class="btn btn-secondary todo_btn"
              @click="completedTodo(item)"
              v-else
            >
              취소
            </button>
            <button
              class="btn btn-danger todo_btn"
              @click="deleteTodo(item.id)"
            >
              삭제
            </button>
          </div>
        </li>
      </ul>
      <br />
      <div class="wrap_input">
        <input
          type="text"
          class="form-control"
          placeholder="검색어를 입력해주세요."
          v-model="searchTitle"
          @keypress.enter="searchTodo()"
        />
        <button class="btn btn-danger" @click="searchTodo()">검색</button>
      </div>
    </div>

    <DetailTodo :selectItem="selectItem" />
  </div>
</template>

<script lang="ts">
import DetailTodo from "@/components/DetailTodo.vue";
import Util from "../module/Util";

interface ListItem {
  date: string;
  title: string;
  id: number;
  completed: boolean;
}

interface Result {
  code: string;
  data: {
    completed: boolean;
    createAt: string;
    date: string;
    id: string;
    title: string;
    updateAt: string;
    user: string;
  }[];
  message: string;
  status: number;
}

interface Files {
  lastMedified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

interface SelectTodo {
  completed: boolean;
  createdAt: string;
  date: string;
  id: string;
  title: string;
  updateAt: string;
  user: string;
}

interface Data<T> {
  todoParam: {
    date: string;
    title: string;
    user: string;
  };
  todoList: T[] | {};
  selectItem: T | {};
  searchTitle: string;
  profileImage: any;
  byteLength: number;
  byteLengthLimite: number;
  oldTodoTitle: string;
}

export default {
  name: "node",
  components: { DetailTodo },
  data(): Data<SelectTodo> {
    return {
      todoParam: {
        date: "",
        title: "",
        user: "",
      },
      todoList: {},
      selectItem: {},
      searchTitle: "",
      profileImage: null,
      byteLength: 0,
      byteLengthLimite: 80,
      oldTodoTitle: "",
    };
  },
  async mounted() {
    this.loadTodo();
  },
  methods: {
    async loadHtml(target: string) {
      const res = await Util.get({
        self: this,
        url: `/html/${target}`,
      });

      target === "nav" && this.$refs.nav instanceof HTMLDivElement
        ? (this.$refs.nav.innerHTML = res.data)
        : target === "slider" && this.$refs.slider instanceof HTMLDivElement
        ? (this.$refs.slider.innerHTML = res.data)
        : null;
    },

    async loadTodo() {
      const res: { data: Result } = await Util.get({
        self: this,
        url: `/api/todo/list`,
      });

      this.todoList = res.data.data;
    },

    async saveTodo() {
      if (!this.todoParam.title) return alert("할일을 입력해주세요.");
      if (!this.todoParam.date) return alert("날짜를 입력해주세요.");
      this.todoParam.user = this.$store.state.member.memberInfo.name;

      await Util.post({
        self: this,
        url: `/api/todo/create`,
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

      let url = `/api/todo/list/delete`;
      let params = { id, user: this.$store.state.member.memberInfo.name };

      await Util.post({ self: this, url, params })
        .then((res: { [key: string]: any }) => {
          res.data.status === 200 ? alert("삭제가 완료됐습니다.") : null;
        })
        .catch((err) => {
          console.log(err);
        });

      this.loadTodo();
    },

    async completedTodo(item: ListItem) {
      let url = `/api/todo/list/update`;
      let params = { id: item.id, completed: !item.completed };

      await Util.post({ self: this, url, params })
        .then((res: { [key: string]: any }) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      this.loadTodo();
    },

    async searchTodo() {
      if (this.searchTitle?.length < 2)
        return alert("검색어는 두글자 이상 입력해주세요.");

      let url = `/api/todo/search`;
      let params = { title: this.searchTitle };

      await Util.get({ self: this, url, params }).then((res) => {
        if (res.status === 200) {
          this.todoList = res.data.data;
          this.searchTitle = "";
        }
      });
    },

    onInput() {
      this.byteLength = Util.getByteLength(this.todoParam.title);

      if (this.byteLength <= this.byteLengthLimite) {
        this.oldTodoTitle = this.todoParam.title;
      } else {
        this.todoParam.title = this.oldTodoTitle;
        this.byteLength = Util.getByteLength(this.todoParam.title);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.nav_wrap {
  margin-top: 20px;
  padding: 0 10px;
}
.nav_wrap .navbar {
  background: #fff !important;
}
.slider_wrap {
  background: #fff;
}
.sub_title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-group-item > .completed {
  text-decoration: line-through;
}
.todo_btn {
  width: 55px;
  --bs-btn-padding-y: 0.25rem;
  --bs-btn-padding-x: 0.5rem;
  --bs-btn-font-size: 0.75rem;
}
.wrap_input {
  display: flex;
}
.wrap_input input {
  margin-right: 10px;
}
.wrap_input button {
  min-width: 120px;
}
</style>
