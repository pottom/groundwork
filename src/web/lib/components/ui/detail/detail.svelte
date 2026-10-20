<script lang="ts">
  import type { Snippet } from "svelte";

  /**
   * A small, quiet line under an `Item`'s title, for example a blocker the ticket waits on.
   * `label`: a short prefix (for example "vár"). `number`: after it, in the same typeface as the rows' numbers.
   * `warning`: asks for attention, for example a blocker that does not exist.
   */
  let {
    label,
    number,
    variant = "default",
    children,
  }: { label?: string; number?: string; variant?: "default" | "warning"; children: Snippet } = $props();

  const variants = {
    default: "text-muted-foreground",
    warning: "text-warning",
  };
</script>

<span class={["block text-sm text-pretty", variants[variant]]}>
  {#if label}{label}{/if}
  {#if number}<span class="font-mono tabular-nums">{number}</span>{/if}
  {@render children()}
</span>
