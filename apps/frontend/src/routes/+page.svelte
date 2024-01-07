<script lang="ts">
  import { trpcClient } from '$lib/trpc/index.js';

  const { data } = $props();

  type Todo = (typeof data.todos)[0] & { loading?: boolean; completed: boolean | null };

  type Filters = 'all' | 'active' | 'completed';

  let todos = $state<Todo[]>(data.todos);
  let filter = $state<Filters>('all');
  let filteredTodos = $derived(filterTodos());
  let loading = $state(false);
  let newTodoInput = $state('');

  async function addTodo() {
    const todo = {
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: 'empty',
      loading: true,
      id: crypto.randomUUID(),
      title: newTodoInput,
    };
    todos.unshift(todo);
    loading = true;
    newTodoInput = '';
    try {
      const result = await trpcClient.todo.create.mutate({
        title: todo.title,
        description: 'empty',
      });
      todos[0] = result;
      todo.loading = false;
    } catch (_e) {
      todos.shift();
    }
    loading = false;
  }

  async function editTodo(index: number) {
    const todo = todos[index];
    todo.loading = true;
    await trpcClient.todo.update.mutate({
      todoId: todo.id,
      title: todo.title,
    });
    todo.loading = false;
  }

  async function toggleTodo(index: number) {
    const todo = todos[index];
    todo.completed = !todo.completed;
    todo.loading = true;
    await trpcClient.todo.update.mutate({
      todoId: todo.id,
      completed: todo.completed,
    });
    todo.loading = false;
  }

  function filterTodos() {
    switch (filter) {
      case 'all':
        return todos;
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
    }
  }
</script>

<div class="add-todo">
  <input
    bind:value={newTodoInput}
    onkeydown={(e) => {
      if (e.key !== 'Enter') return;
      addTodo();
    }}
    placeholder="Add new TODO"
    type="text"
  />
  <button aria-busy={loading ? 'true' : null} onclick={() => addTodo()}>Add</button>
</div>

<div class="filter">
  <select bind:value={filter}>
    <option value="all" selected>Select</option>
    <option value="active">Active</option>
    <option value="completed">Completed</option>
  </select>
  <div></div>
</div>

<div class="todos">
  {#each filteredTodos as todo, i (todo.id)}
    <div class="todo" class:completed={todo.completed}>
      <input onblur={() => editTodo(i)} bind:value={todo.title} type="text" disabled={todo.loading} />
      <input onchange={() => toggleTodo(i)} checked={todo.completed} type="checkbox" disabled={todo.loading} />
    </div>
  {/each}
</div>

<style>
  .add-todo {
    width: 40rem;
    gap: 1rem;
    display: grid;
    grid-template-columns: 5fr 1fr;
  }

  .todos {
    width: 40rem;
    display: grid;
  }

  .todo {
    position: relative;
    transition: opacity 0.3s;
  }

  .completed {
    opacity: 0.4;
  }

  input[type='text'] {
    padding: 1rem;
  }

  input[type='checkbox'] {
    position: absolute;
    right: 1%;
    top: 42%;
    translate: 0% -50%;
  }

  .filter {
    width: 40rem;
    gap: 1rem;
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 4fr;
  }
</style>
