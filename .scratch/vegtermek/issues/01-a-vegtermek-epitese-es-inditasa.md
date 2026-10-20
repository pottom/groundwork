# 01: A végtermék építése és indítása

**What to build:** `npm run build` elkészít egy kis, önálló mappát (lefordított felület + egyetlen, minden függőséget tartalmazó szerverfájl), amely `npm install` nélkül, csak Node-dal indul: `node <mappa>/groundwork.mjs --root <projekt>`. Kiírja a címet és megnyitja a böngészőt (`--no-open`-nel nem), a `--port` foglaltsága esetén a következő szabad portot használja, csak 127.0.0.1-en figyel, és ugyanazt mutatja élő frissítéssel, mint fejlesztői módban. A build kiírja a végtermék méretét.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] `npm run build` elkészíti a végtermék mappáját, és kiírja a méretét
- [x] A mappa `node_modules` nélküli helyre másolva is elindul csak Node-dal (füstteszt)
- [x] `--root`, `--port`, `--no-open`, `--help` működik; foglalt portnál a következő szabadot használja és kiírja
- [x] Nem létező `--root` mappára érthető hibaüzenet
- [x] Csak 127.0.0.1-en figyel
- [x] A példaprojekten ugyanazt mutatja, mint fejlesztői módban, élő frissítéssel
- [x] Ctrl+C-re tisztán leáll
- [x] `npm run check` zöld

## Comments

**2026-10-20, átnézve és elfogadva:** három commitban (`3037184`, `77b2f2e`, `dee2091`). `npm run build` → `dist/groundwork/` (603,6 kB: `groundwork.mjs` 547,1 kB, felület 56,5 kB). 41 teszt zöld, ebből 8 a `node_modules` nélküli füstteszt. A példaprojekten a 4477-es porton ugyanazt mutatja, mint fejlesztői módban. Nyitott: a szerver nincs minifikálva (kb. 240 kB lenne), a Windows-os böngészőnyitás nincs kipróbálva.
