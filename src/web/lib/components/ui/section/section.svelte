<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<section class="flex flex-col gap-3">
  {@render children()}
</section>
