<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<p class="text-muted-foreground rounded-lg border border-dashed px-6 py-10 text-center text-pretty">
  {@render children()}
</p>
