<svelte:head>
  <title>Svelte 5 Todo App</title>
</svelte:head>

<main>
  <slot />
</main>

<style>
  @import 'open-props/style';
  @import 'open-props/normalize';
  @import 'open-props/buttons';

  :global(html, body) {
    height: 100%;
  }

  :global(body) {
    display: grid;
    place-content: center;
    color: hsl(220 10% 98%);
    background-color: hsl(220 10% 8%);
  }
</style>
