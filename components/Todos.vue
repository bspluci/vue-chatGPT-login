<template>
  <div>
    <br />
    <button @click="setMemberInfo">회원정보 불러오기</button>
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

interface Data {
  [key: string]: string | number;
}

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
    async setMemberInfo() {
      let url = "/cls/api/v1/member";

      let memberInfo: Data = await this.$axios.$get(url);
      this.$store.commit("memberInfo/setMemberInfo", memberInfo.data);
    },
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
