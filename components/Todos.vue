<template>
  <div>
    <h1 class="title">VUEX TODO</h1>
    <ul>
      <li class="todo-list" v-for="(todo, idx) in todos" :key="idx">
        <div class="todo-inner">
          <input
            class="todo-select"
            type="checkbox"
            :checked="todo.done"
            @change="toggle(todo)"
          />
          <span class="todo-content" :class="{ done: todo.done }">{{
            todo.text
          }}</span>
        </div>
        <button class="btn btn-danger btn-close" @click="remove(todo)">
          X
        </button>
      </li>
    </ul>
    <div>
      <input
        class="form-control"
        placeholder="What needs to be done?"
        @keyup.enter="addTodo"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { mapMutations, mapGetters } from "vuex";

export default {
  computed: {
    todos() {
      return this.$store.state.todos.list;
    },
  },
  data() {
    return {
      memberInfo: null,
    };
  },
  methods: {
    ...mapGetters({
      list: "todos/list",
    }),
    ...mapMutations("todos", {
      toggle: "toggle",
      remove: "remove",
      add: "add",
    }),
    addTodo(e: { [key: string]: any }) {
      // this.$store.commit("todos/add", e.target.value);
      this.add(e.target.value);
      e.target.value = "";
    },
  },
};
</script>

<style scoped>
.done {
  text-decoration: line-through;
}
.btn-close {
  width: 22px;
  height: 22px;
  padding: 0;
}
.todo-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 10px;
  border: 1px solid #ddd;
}
.todo-inner {
}
.todo-select {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
.todo-content {
  margin: 0 10px;
  font-size: 22px;
  vertical-align: middle;
}
</style>
