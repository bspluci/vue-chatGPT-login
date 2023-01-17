<template>
  <div>
    <h1>VUEX TODO</h1>
    <ul>
      <li v-for="(todo, idx) in todos" :key="idx">
        <input type="checkbox" :checked="todo.done" @change="toggle(todo)" />
        <span :class="{ done: todo.done }">{{ todo.text }}</span>
        <button @click="remove(todo)">X</button>
      </li>
      <li>
        <input placeholder="What needs to be done?" @keyup.enter="addTodo" />
      </li>
    </ul>
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

<style>
.done {
  text-decoration: line-through;
}
</style>
