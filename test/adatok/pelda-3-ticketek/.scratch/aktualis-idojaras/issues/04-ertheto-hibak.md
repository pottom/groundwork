# 04: Érthető hibák

**What to build:** ha a beírt névre nincs Település, a tag ezt olvassa: „Nincs ilyen nevű település.” Ha az időjárás-szolgáltatás nem érhető el, vagy hibás választ ad, ezt: „Most nem érjük el az időjárás-szolgáltatást. Próbáld újra kicsit később.” Technikai részlet nem jelenik meg. Üres vagy csak szóközből álló mezővel nem indul keresés, és a név elején, végén lévő szóközök nem rontják el a keresést.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Ismeretlen névre a „Nincs ilyen nevű település.” mondat látszik
- [ ] Hálózati hibára és hibás válaszra a „Most nem érjük el az időjárás-szolgáltatást. Próbáld újra kicsit később.” mondat látszik
- [ ] Hibánál nem látszik technikai részlet
- [ ] Üres vagy csak szóközből álló mezővel nem indul keresés
- [ ] A „ Zirc ” (szóközökkel) ugyanazt adja, mint a „Zirc”
- [ ] Az időjárás modul a két hibát megkülönböztethetően adja vissza, és ezt teszt fedi le
- [ ] `npm run check` zöld
