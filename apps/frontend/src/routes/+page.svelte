<script lang="ts">
  const { data } = $props();

  type Todo = (typeof data.todos)[0];

  type Filters = 'all' | 'active' | 'completed';

  let todos = $state<Todo[]>([]);
  let filter = $state<Filters>('all');
  let filteredTodos = $derived(filterTodos());

  async function addTodo(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;

    const todoEl = event.target as HTMLInputElement;
    const title = todoEl.value;

    todos = [
      ...todos,
      {
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'description',
        id: crypto.randomUUID(),
        title,
      },
    ];

    todoEl.value = '';

    //FIXME:
    //this is not working yet
    //there's a missing cookie
    //should I have both cookie and local storage in the frontend?
    //or make the backend accept cookies instead?
    // await trpcClient().todo.create.mutate({
    //   title,
    //   description: 'description',
    // });
  }

  function editTodo(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const index = +inputEl.dataset.index!;
    todos[index].title = inputEl.title;
  }

  function toggleTodo(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const index = +inputEl.dataset.index!;
    todos[index].completed = !todos[index].completed;
  }

  function setFilter(newFilter: Filters) {
    filter = newFilter;
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

  function remaining() {
    return todos.filter((todo) => !todo.completed).length;
  }
</script>

<input onkeydown={addTodo} placeholder="Add todo" type="text" />

<div class="todos">
  {#each filteredTodos as todo, i}
    <div class:completed={todo.completed} class="todo">
      <input oninput={editTodo} data-index={i} value={todo.title} type="text" />
      <input onchange={toggleTodo} data-index={i} checked={todo.completed} type="checkbox" />
    </div>
  {/each}
</div>

<div class="filters">
  <button onclick={() => setFilter('all')}>All</button>
  <button onclick={() => setFilter('active')}>Active</button>
  <button onclick={() => setFilter('completed')}>Completed</button>
</div>

<p>{remaining()} remaining</p>

<style>
  .todos {
    display: grid;
    gap: 1rem;
    margin-block-start: 1rem;
  }

  .todo {
    position: relative;
    transition: opacity 0.3s;
  }

  .completed {
    opacity: 0.4;
  }

  input[type='text'] {
    width: 100%;
    padding: 1rem;
  }

  input[type='checkbox'] {
    position: absolute;
    right: 4%;
    top: 50%;
    translate: 0% -50%;
  }

  .filters {
    margin-block: 1rem;
  }
</style>
