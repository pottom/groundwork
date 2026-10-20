// A hőmérséklet megjelenítése. Tiszta függvény: számot kap, szöveget ad
// vissza, a böngészőhöz nem nyúl, ezért könnyű tesztelni.

export function formazHomerseklet(celsius: number): string {
  const kerekitett = Math.round(celsius);
  // a -0 ne jelenjen meg mínuszjellel
  return `${kerekitett === 0 ? 0 : kerekitett} °C`;
}
