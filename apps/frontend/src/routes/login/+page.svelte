<script lang="ts">
  import { applyAction } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { trpcClient } from '$lib/trpc';

  let error = $state<Error | null>(null);

  async function handleLogin(event: { currentTarget: EventTarget & HTMLFormElement }) {
    const data = new FormData(event.currentTarget);

    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();

    if (!email || !password) {
      error = new Error('Missing email or password');
      return;
    }

    try {
      await trpcClient.user.login.mutate({ email, password });
    } catch (error) {
      applyAction({ type: 'error', status: 400, error });
      return;
    }

    await invalidateAll();
  }
</script>

<form method="POST" on:submit|preventDefault={handleLogin}>
  <label>
    Email
    <input name="email" type="email" value="test.taqtile@gmail.com" />
  </label>
  <label>
    Password
    <input name="password" type="password" value="ABCDabcd!@#$1234" />
  </label>
  <button>Log in</button>
  <button formaction="?/register">Register</button>
</form>
