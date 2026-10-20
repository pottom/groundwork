<script lang="ts">
  /** How many are done out of the total, for example "2/7". If there is nothing to count, an empty space remains so the column stays aligned. */
  let { done, total }: { done: number; total: number } = $props();
</script>

<span class="text-muted-foreground min-w-10 shrink-0 text-right font-mono text-sm whitespace-nowrap tabular-nums">
  {#if total > 0}{done}/{total}{/if}
</span>
