import { describe, it, expect } from "vitest";
import { normalizePhone, formatPhone, maskPhoneInput } from "../phone";

describe("normalizePhone", () => {
  it("принимает форматы, которыми реально пользуются в Казахстане", () => {
    const expected = "+77071234567";
    for (const input of [
      "+77071234567",
      "+7 707 123 45 67",
      "+7 (707) 123-45-67",
      "8 707 123 45 67",
      "87071234567",
      "7071234567",
      "  8(707)1234567  ",
    ]) {
      expect(normalizePhone(input), input).toBe(expected);
    }
  });

  it("отсекает всё, что не мобильный номер РК", () => {
    for (const input of [
      "",
      null,
      undefined,
      "123",
      "+7 727 250 00 00", // городской Алматы — не мобильный
      "+79161234567",     // российский номер
      "+770712345678",    // лишняя цифра
      "не телефон",
    ]) {
      expect(normalizePhone(input as string), String(input)).toBeNull();
    }
  });
});

describe("formatPhone", () => {
  it("приводит к читаемому виду для админки и выгрузки", () => {
    expect(formatPhone("87071234567")).toBe("+7 (707) 123-45-67");
  });

  it("невалидное возвращает как есть, а не теряет", () => {
    expect(formatPhone("+7 727 250 00 00")).toBe("+7 727 250 00 00");
  });
});

describe("maskPhoneInput", () => {
  it("держит префикс +7 и достраивает разделители по мере ввода", () => {
    expect(maskPhoneInput("")).toBe("+7");
    expect(maskPhoneInput("7")).toBe("+7");
    expect(maskPhoneInput("770")).toBe("+7 (70");
    expect(maskPhoneInput("7707")).toBe("+7 (707)");
    expect(maskPhoneInput("7707123")).toBe("+7 (707) 123");
    expect(maskPhoneInput("77071234567")).toBe("+7 (707) 123-45-67");
  });

  it("превращает местную восьмёрку в код страны", () => {
    expect(maskPhoneInput("87071234567")).toBe("+7 (707) 123-45-67");
  });

  it("не даёт ввести лишние цифры", () => {
    expect(maskPhoneInput("770712345679999")).toBe("+7 (707) 123-45-67");
  });
});
