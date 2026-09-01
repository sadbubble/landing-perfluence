/**
 * Конфиг Supabase без импорта клиентской библиотеки.
 *
 * Лендинг обращается к базе только при отправке заявки. Поэтому здесь
 * НЕТ падения при отсутствии ключей: без них страница обязана открываться
 * и выглядеть как положено — дизайн можно показывать до того, как заведён
 * проект Supabase. Проверка перенесена в точку реального использования.
 */
export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) ?? "";
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    "Supabase не настроен: нет VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY в .env.local.\n" +
      "Лендинг работает, но отправка заявки и панель /admin будут недоступны.\n" +
      "Инструкция: docs/setup-supabase.md",
  );
}

/** Бросает понятную ошибку в момент обращения к базе, а не при загрузке страницы. */
export function assertSupabaseConfigured(): void {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase не настроен: заполните .env.local по образцу .env.example",
    );
  }
}

/**
 * Адрес приёмника заявок. Сейчас указывает в никуда: бэкенда у проекта нет,
 * заявки должны уходить в Qbox. Подставьте сюда его адрес, когда он будет
 * известен, — больше нигде менять не придётся.
 */
export const SUBMIT_LEAD_URL = `${SUPABASE_URL}/functions/v1/submit-lead`;
