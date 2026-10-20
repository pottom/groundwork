<script lang="ts">
  import type { Snippet } from "svelte";

  /**
   * Egy sor az `ItemList`-ben: szám, cím, és a végén például egy `Badge` és egy `Progress`.
   * `dimmed`: halványan, hogy a többi sor kiemelkedjen (például egy lezárt ticket).
   */
  let {
    number,
    title,
    dimmed = false,
    children,
  }: { number: string; title: string; dimmed?: boolean; children?: Snippet } = $props();
</script>

<li class={["flex items-baseline gap-3 py-3", dimmed && "opacity-55"]}>
  <span class="text-muted-foreground min-w-6 shrink-0 font-mono text-sm tabular-nums">{number}</span>
  <span class="text-foreground min-w-0 flex-1 text-pretty">{title}</span>
  {@render children?.()}
</li>
