# 04: Újrafuttatás és kivétel

**What to build:** egy már előkészített projektben a skill először ellenőriz: érvényes-e a `config.json`, egyezik-e a `README.md` a sablonnal, megvan-e és naprakész-e a jelölt blokk; az eltérést jelzi, és felajánlja a javítást. Utána felkínálja, mit tehet (ebben a ticketben: kivétel; a többi lehetőség a későbbi ticketekkel jön). Ha a hívás megnevezi a célt (például a kivételt), egyből arra megy. A kivétel jóváhagyás után kiveszi a `.groundwork/` mappát és minden `groundwork:begin` / `groundwork:end` jelölt blokkot a jelölőkkel együtt, mást nem. A kézzel beírt szabályhoz nem nyúl. Lásd a specet: `.scratch/groundwork-setup/spec.md`.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] Próba: a `0-indulas` előkészítése után újrafuttatva a skill rendben találja, és felkínálja a lehetőségeket; nem ír semmit, amíg nem választok
- [ ] Ha a `README.md`-t vagy a jelölt blokkot kézzel elrontom, a skill jelzi, és jóváhagyás után helyreállítja
- [ ] Két egymás utáni előkészítés ugyanazt írja (nincs duplikált blokk)
- [ ] Kivétel a `0-indulas` előkészítése után: a `git diff` a taghez képest üres
- [ ] Kivétel a `4-epul` előkészítése után: a kézzel beírt szabály marad, a `git diff` a taghez képest üres
- [ ] A `/setup-groundwork` hívás a célt megnevezve (például kivétel) egyből arra megy, a jóváhagyást akkor is kéri

## Comments
