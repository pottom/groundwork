<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<main class="mx-auto min-h-svh w-full max-w-3xl px-6 py-16 sm:py-24">
  {@render children()}
</main>
