export const state = () => ({
  list: [],
});

interface TodoList {
  list: [{ done: boolean; text: string }];
}
export const mutations = {
  add(state: TodoList, text: string) {
    state.list.push({
      text: text,
      done: false,
    });
  },
  remove(state: TodoList, todo: { done: boolean; text: string }) {
    state.list.splice(state.list.indexOf(todo), 1);
  },
  toggle(state: TodoList, todo: { done: boolean }) {
    todo.done = !todo.done;
  },
};
