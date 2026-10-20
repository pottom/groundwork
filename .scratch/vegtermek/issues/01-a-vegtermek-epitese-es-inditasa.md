# 01: A végtermék építése és indítása

**What to build:** `npm run build` elkészít egy kis, önálló mappát (lefordított felület + egyetlen, minden függőséget tartalmazó szerverfájl), amely `npm install` nélkül, csak Node-dal indul: `node <mappa>/groundwork.mjs --root <projekt>`. Kiírja a címet és megnyitja a böngészőt (`--no-open`-nel nem), a `--port` foglaltsága esetén a következő szabad portot használja, csak 127.0.0.1-en figyel, és ugyanazt mutatja élő frissítéssel, mint fejlesztői módban. A build kiírja a végtermék méretét.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `npm run build` elkészíti a végtermék mappáját, és kiírja a méretét
- [ ] A mappa `node_modules` nélküli helyre másolva is elindul csak Node-dal (füstteszt)
- [ ] `--root`, `--port`, `--no-open`, `--help` működik; foglalt portnál a következő szabadot használja és kiírja
- [ ] Nem létező `--root` mappára érthető hibaüzenet
- [ ] Csak 127.0.0.1-en figyel
- [ ] A példaprojekten ugyanazt mutatja, mint fejlesztői módban, élő frissítéssel
- [ ] Ctrl+C-re tisztán leáll
- [ ] `npm run check` zöld
