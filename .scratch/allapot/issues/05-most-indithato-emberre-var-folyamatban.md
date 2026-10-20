# 05: „Most”: mi indítható, mi vár rám, mi van folyamatban

**What to build:** az oldal tetején a „Most” rész három csoportot mutat. *Indítható:* `ready-for-agent` és nem blokkolt. *Emberre vár:* `ready-for-human`, `needs-info` vagy `needs-triage`, és nem blokkolt. *Folyamatban:* `claimed`. Egy nyitott ticket blokkolt, ha a `**Blocked by:**` sorában (számok vesszővel; a `None…` kezdetű érték üres) van olyan, ugyanazon a területen lévő ticket, amely nem lezárt.

**Blocked by:** 03

**Status:** claimed

- [ ] A példaprojekten az Indítható csoportban a 01 látszik, az Emberre vár csoport üres
- [ ] A 05 (emberre vár, de blokkolt) nem jelenik meg az Emberre vár csoportban
- [ ] Egy lezárt blokkoló után a ticket indíthatóvá válik (tesztmappa)
- [ ] Egy `claimed` ticket a Folyamatban csoportban látszik (tesztmappa)
- [ ] Üres csoportnál rövid, nyugodt üzenet látszik
- [ ] `npm run check` zöld
