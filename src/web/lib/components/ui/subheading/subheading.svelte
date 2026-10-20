<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<h2 class="text-foreground border-b pb-2 text-2xl font-semibold tracking-tight text-balance">
  {@render children()}
</h2>
