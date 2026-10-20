<script lang="ts">
  import type { Snippet } from "svelte";

  /** A short, quiet note, for example in place of an empty group. */
  let { children }: { children: Snippet } = $props();
</script>

<p class="text-muted-foreground py-3 text-sm text-pretty">
  {@render children()}
</p>
