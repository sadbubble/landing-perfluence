import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";

/**
 * Клиент для админки: нужен ради Auth и запросов с сессией сотрудника.
 * На лендинге не используется — там достаточно fetch (см. lib/config.ts).
 *
 * Anon-ключ публичен по замыслу: он попадает в браузер, а данные защищены
 * политиками RLS. service_role здесь быть не должно ни при каких условиях.
 */
export const supabase = createClient(
  // Заглушки нужны только чтобы createClient не бросил исключение на пустой
  // строке. Запросы с ними всё равно не пройдут, и панель об этом сообщает.
  isSupabaseConfigured ? SUPABASE_URL : "https://not-configured.invalid",
  isSupabaseConfigured ? SUPABASE_ANON_KEY : "not-configured",
  { auth: { persistSession: true, autoRefreshToken: true } },
);
