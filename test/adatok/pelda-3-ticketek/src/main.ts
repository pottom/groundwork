// Az app belépési pontja. Most még csak egy üres kártyát rajzol ki:
// az időjárás-funkciókat a tanfolyamon az agenttel együtt építed meg.

import "./style.css";
import { formazHomerseklet } from "./homerseklet";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <main class="kartya">
    <h1>Időjárás</h1>
    <p class="homerseklet">${formazHomerseklet(21.4)}</p>
    <p class="megjegyzes">Ez még csak egy minta. Az igazi időjárást a tanfolyamon építed meg az agenttel.</p>
  </main>
`;
