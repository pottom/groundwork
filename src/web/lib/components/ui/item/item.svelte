<script lang="ts">
  import type { Snippet } from "svelte";

  /**
   * Egy sor az `ItemList`-ben: szám, cím, és a végén például egy `Badge` és egy `Progress`.
   * `dimmed`: halványan, hogy a többi sor kiemelkedjen (például egy lezárt ticket).
   * `details`: a cím alatt, például `Detail` sorok (mire vár egy blokkolt ticket).
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
