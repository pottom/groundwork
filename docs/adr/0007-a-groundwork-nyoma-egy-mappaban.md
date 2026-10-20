# Amit a Groundwork egy projektbe tesz, az egy mappában van, és kivehető

**Status:** accepted

Minden, amit a Groundwork (a setup skillje) egy projektbe tesz, egyetlen saját mappába kerül (`.groundwork/`), hogy a projekt nélküle is ép maradjon, és a Groundwork nyomtalanul kivehető legyen. Matt Pocock fájljaihoz (`docs/agents/`, `CLAUDE.md`/`AGENTS.md`) csak ott nyúlunk, ahol a skillek máshonnan nem olvasnak, és akkor is minimálisan: egy jól elhatárolt, jelölt blokkal (például a ticket lezárásának szabálya az `issue-tracker.md`-ben), amelyet a kivétel pontosan visszavesz. A setup háromféle helyzetet kezel: nulláról induló projektet, már futó projektet, és a Groundwork kivételét. Ez a régi Groundwork tanulsága: ott az `init` a projekt több pontjára írt (skillek, hookok, beállítások), és a kivétele külön kidolgozatlan igény maradt. Az ára: amit a skillek csak a saját fájljaikból olvasnak, azt nem tehetjük a saját mappánkba, így a jelölt blokkokat karban kell tartani.
