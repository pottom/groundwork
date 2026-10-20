<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<h1 class="text-foreground text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
  {@render children()}
</h1>
