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
</script>

<span
  class={[
    "block text-sm text-pretty",
    variant === "warning" ? "text-warning" : "text-muted-foreground",
  ]}
>
  {#if label}{label}{/if}
  {#if number}<span class="font-mono tabular-nums">{number}</span>{/if}
  {@render children()}
</span>
