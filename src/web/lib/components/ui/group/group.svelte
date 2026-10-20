<script lang="ts">
  import type { Snippet } from "svelte";

  /** Egy szakaszon belüli csoport: kis, halk címmel, alatta például egy `ItemList` vagy egy `Note`. */
  let { title, children }: { title: string; children: Snippet } = $props();
</script>

<section class="flex flex-col">
  <h3 class="text-muted-foreground text-sm font-medium">{title}</h3>
  {@render children()}
</section>
