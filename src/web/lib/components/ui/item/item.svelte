<script lang="ts">
  import type { Snippet } from "svelte";

  /**
   * A row in an `ItemList`: number, title, and at the end, for example, a `Badge` and a `Progress`.
   * `dimmed`: faded, so the other rows stand out (for example a closed ticket).
   * `details`: under the title, for example `Detail` lines (what a blocked ticket waits on).
   */
  let {
    number,
    title,
    dimmed = false,
    details,
    children,
  }: { number: string; title: string; dimmed?: boolean; details?: Snippet; children?: Snippet } = $props();
</script>

<li class={["flex items-baseline gap-3 py-3", dimmed && "opacity-55"]}>
  <span class="text-muted-foreground min-w-6 shrink-0 font-mono text-sm tabular-nums">{number}</span>
  <div class="flex min-w-0 flex-1 flex-col gap-1">
    <span class="text-foreground text-pretty">{title}</span>
    {@render details?.()}
  </div>
  {@render children?.()}
</li>
