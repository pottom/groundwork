<script lang="ts">
  import type { Snippet } from "svelte";

  /**
   * A quiet, floating notice at the bottom of the page, for example when the connection to the server dropped.
   * It floats above the content and does not push it aside.
   */
  let { children }: { children: Snippet } = $props();
</script>

<p
  role="status"
  class="bg-background text-muted-foreground fixed inset-x-0 bottom-6 mx-auto w-fit max-w-[calc(100%-2rem)] rounded-full border px-4 py-2 text-sm text-pretty shadow-sm"
>
  {@render children()}
</p>
