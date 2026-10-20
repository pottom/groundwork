import { describe, expect, it } from "vitest";
import { formazHomerseklet } from "../src/homerseklet";

describe("formazHomerseklet", () => {
  it("egészre kerekít, és mögé írja a mértékegységet", () => {
    expect(formazHomerseklet(21.4)).toBe("21 °C");
    expect(formazHomerseklet(21.5)).toBe("22 °C");
  });

  it("fagypont alatt mínusszal írja", () => {
    expect(formazHomerseklet(-3.2)).toBe("-3 °C");
  });

  it("a nulla körüli értéket nem írja -0-nak", () => {
    expect(formazHomerseklet(-0.3)).toBe("0 °C");
  });
});
