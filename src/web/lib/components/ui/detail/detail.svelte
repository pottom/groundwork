<script lang="ts">
  import type { Snippet } from "svelte";

  /**
   * Egy kis, halk sor egy `Item` címe alatt, például egy blokkoló, amelyre a ticket vár.
   * `label`: rövid előtag (például „vár”). `number`: utána, a sorok számaival egy betűtípussal.
   * `warning`: figyelmet kér, például egy nem létező blokkoló.
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
