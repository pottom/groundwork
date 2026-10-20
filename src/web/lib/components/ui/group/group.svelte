<script lang="ts">
  import type { Snippet } from "svelte";

  /** A group within a section: with a small, quiet title, and below it, for example, an `ItemList` or a `Note`. */
  let { title, children }: { title: string; children: Snippet } = $props();
</script>

<section class="flex flex-col">
  <h3 class="text-muted-foreground text-sm font-medium">{title}</h3>
  {@render children()}
</section>
