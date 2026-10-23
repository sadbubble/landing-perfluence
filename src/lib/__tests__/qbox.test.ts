import { describe, it, expect } from "vitest";
import {
  EMBED_ALLOWED_ORIGINS,
  QBOX_PRODUCTS,
  buildEmbedUrl,
  buildFormUrl,
  canEmbedForm,
  resolveProduct,
} from "../qbox";

describe("canEmbedForm", () => {
  it("окно с формой — на боевом сайте, тестовых стендах КТ и при разработке", () => {
    for (const origin of [
      "https://telecom.kz",
      "https://staging-srv-0.telecom.kz",
      "https://staging-customer.telecom.kz",
      "https://partner.telecom.kz",
      "http://localhost:8080",
      "http://localhost:4200",
      "http://localhost:4502",
    ]) {
      expect(canEmbedForm(origin), origin).toBe(true);
    }
  });

  it("переход — там, где Qbox рамку не пустит", () => {
    for (const origin of [
      "https://landing-perfluence.vercel.app",
      "https://www.telecom.kz",
      "http://127.0.0.1:8080",
      "http://localhost:5173",
      "http://telecom.kz",
    ]) {
      expect(canEmbedForm(origin), origin).toBe(false);
    }
  });

  it("в списке только полные origin без слэша на конце", () => {
    for (const origin of EMBED_ALLOWED_ORIGINS) {
      expect(new URL(origin).origin).toBe(origin);
    }
  });
});

describe("адрес формы", () => {
  const product = "Интернет 500 (контракт 1 год)";

  it("параметры лида до «#», embed=true — после идентификатора формы", () => {
    const url = buildEmbedUrl(product, "test", "kk");
    const [beforeHash, fragment] = url.split("#");
    expect(beforeHash.startsWith("https://qbox.telecom.kz/forms/?")).toBe(true);
    const query = new URLSearchParams(beforeHash.split("?")[1]);
    expect(query.get("manager")).toBe("test");
    expect(query.get("Product_name")).toBe(product);
    expect(query.get("lang")).toBe("kk");
    expect(fragment).toBe("/7a52f500b34f49ad8fd63599e74a2ca5?embed=true");
  });

  it("пробел кодируется как %20, а не «+»", () => {
    expect(buildEmbedUrl(product, null, "ru")).toContain("%20500%20");
    expect(buildEmbedUrl(product, null, "ru")).not.toContain("+");
  });

  it("запасная ссылка — тот же адрес без embed=true", () => {
    expect(buildFormUrl(product, "test", "ru")).toBe(
      buildEmbedUrl(product, "test", "ru").replace("?embed=true", ""),
    );
  });

  it("без менеджера и тарифа уходит только язык", () => {
    expect(buildEmbedUrl(null, null, "ru")).toBe(
      "https://qbox.telecom.kz/forms/?lang=ru#/7a52f500b34f49ad8fd63599e74a2ca5?embed=true",
    );
  });
});

describe("названия тарифов для Qbox", () => {
  it("одиннадцать сочетаний, у каждого своё название", () => {
    const values = Object.values(QBOX_PRODUCTS);
    expect(values).toHaveLength(11);
    expect(new Set(values).size).toBe(11);
  });

  it("неизвестное сочетание — заявка без тарифа, а не выдуманное название", () => {
    expect(resolveProduct({ slug: "internet-200", mode: "contract", sim: null })).toBeNull();
    expect(resolveProduct({ slug: "go-smart", mode: "contract", sim: null })).toBe(
      "Go Smart (Altel/Activ, контракт 1 год)",
    );
  });
});
