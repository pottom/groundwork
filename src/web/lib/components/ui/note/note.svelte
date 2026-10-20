<script lang="ts">
  import type { Snippet } from "svelte";

  /** Rövid, halk megjegyzés, például egy üres csoport helyén. */
  let { children }: { children: Snippet } = $props();
</script>

<p class="text-muted-foreground py-3 text-sm text-pretty">
  {@render children()}
</p>
