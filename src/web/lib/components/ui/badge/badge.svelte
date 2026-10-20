<script lang="ts">
  import type { Snippet } from "svelte";

  /** `warning`: figyelmet kér, például egy ismeretlen állapot. */
  let { variant = "secondary", children }: { variant?: "secondary" | "warning"; children: Snippet } = $props();

  const variants = {
    secondary: "bg-secondary text-secondary-foreground border-transparent",
    warning: "border-warning/40 text-warning bg-transparent",
  };
</script>

<span
  class={[
    "inline-flex w-fit shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
    variants[variant],
  ]}
>
  {@render children()}
</span>
