<script>
  import '@picocss/pico';

  import { invalidateAll } from '$app/navigation';
  import { trpcClient } from '$lib/trpc';

  const { data } = $props();
</script>

<svelte:head>
  <title>Svelte 5 Todo App</title>
</svelte:head>

<header>
  {#if data.isLoggedIn}
    <a
      href="/login"
      data-sveltekit-preload-code
      onclick={async () => {
        await trpcClient.user.logout.mutate();
        await invalidateAll();
      }}>Logout</a
    >
  {/if}
</header>
<main>
  <slot />
</main>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: right;
    margin: 30px;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
