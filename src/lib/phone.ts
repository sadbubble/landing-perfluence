/**
 * Нормализация и валидация казахстанских мобильных номеров.
 *
 * Раньше файл лежал в supabase/functions/_shared и был общим для браузера и
 * серверной функции. Бэкенд из проекта убран, поэтому логика переехала сюда:
 * теперь это чисто фронтовая проверка перед отправкой заявки.
 *
 * Когда появится приём заявок на стороне Qbox, ту же проверку стоит
 * повторить и там: браузерную валидацию обходит кто угодно.
 *
 * Зависимостей нет намеренно — файл покрыт тестами и должен оставаться
 * простым.
 */

/** Канонический вид, в котором номер лежит в БД. */
export type NormalizedPhone = `+7${string}`;

/**
 * Коды мобильных операторов Казахстана (Kcell/activ, Beeline, Tele2/Altel).
 * Список закрытый — при появлении нового кода правится здесь, в одном месте.
 */
const KZ_MOBILE_CODES = new Set([
  "700", "701", "702", "703", "704", "705", "706", "707", "708", "709",
  "747", "750", "751",
  "760", "761", "762", "763", "764",
  "771", "775", "776", "777", "778",
]);

/**
 * Приводит любой ввод к виду +77XXXXXXXXX.
 * Принимает: «+7 707 123 45 67», «8 (707) 1234567», «77071234567», «7071234567».
 * Возвращает null, если это не мобильный номер РК.
 */
export function normalizePhone(input: string | null | undefined): NormalizedPhone | null {
  if (!input) return null;

  let digits = String(input).replace(/\D/g, "");

  // 8XXXXXXXXXX -> 7XXXXXXXXXX (привычный местный формат набора)
  if (digits.length === 11 && digits.startsWith("8")) {
    digits = "7" + digits.slice(1);
  }
  // 7071234567 -> 77071234567 (ввели без кода страны)
  if (digits.length === 10 && digits.startsWith("7")) {
    digits = "7" + digits;
  }

  if (digits.length !== 11) return null;
  if (!digits.startsWith("7")) return null;

  // Проверять «начинается с 77» нельзя: код Алматы 727 тоже начинается
  // с семёрки, и городские номера проходили бы как мобильные.
  // ТЗ п.6 требует именно мобильный номер, поэтому сверяем код оператора.
  if (!KZ_MOBILE_CODES.has(digits.slice(1, 4))) return null;

  return `+${digits}` as NormalizedPhone;
}

export function isValidPhone(input: string | null | undefined): boolean {
  return normalizePhone(input) !== null;
}

/** Человекочитаемый вид для админки и выгрузки: +7 (707) 123-45-67 */
export function formatPhone(input: string | null | undefined): string {
  const n = normalizePhone(input);
  if (!n) return input ? String(input) : "";
  const d = n.slice(2); // без «+7»
  return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
}

/**
 * Маска для поля ввода: возвращает то, что должно оказаться в input
 * после каждого нажатия. Всегда держит префикс «+7 ».
 */
export function maskPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (!digits.startsWith("7")) digits = "7" + digits;
  digits = digits.slice(0, 11);

  const rest = digits.slice(1); // до 10 цифр после кода страны
  let out = "+7";
  if (rest.length > 0) out += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) out += `)`;
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
  return out;
}
