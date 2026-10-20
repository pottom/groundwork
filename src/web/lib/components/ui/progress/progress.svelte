<script lang="ts">
  /** Mennyi kész az összesből, például „2/7”. Ha nincs mit számolni, üres hely marad, hogy az oszlop egyben álljon. */
  let { done, total }: { done: number; total: number } = $props();
</script>

<span class="text-muted-foreground min-w-10 shrink-0 text-right font-mono text-sm whitespace-nowrap tabular-nums">
  {#if total > 0}{done}/{total}{/if}
</span>
