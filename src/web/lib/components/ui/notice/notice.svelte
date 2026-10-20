<script lang="ts">
  import type { Snippet } from "svelte";

  /**
   * Halk, lebegő jelzés az oldal alján, például ha a kapcsolat a szerverrel megszakadt.
   * A tartalom fölött lebeg, nem tolja el.
   */
  let { children }: { children: Snippet } = $props();
</script>

<p
  role="status"
  class="bg-background text-muted-foreground fixed inset-x-0 bottom-6 mx-auto w-fit max-w-[calc(100%-2rem)] rounded-full border px-4 py-2 text-sm text-pretty shadow-sm"
>
  {@render children()}
</p>
