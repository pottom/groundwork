<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<span
  class="bg-secondary text-secondary-foreground inline-flex w-fit shrink-0 items-center rounded-md border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap"
>
  {@render children()}
</span>
