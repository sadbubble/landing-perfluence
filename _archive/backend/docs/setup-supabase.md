# Настройка Supabase — пошагово

Порядок важен: миграции ссылаются друг на друга.

---

## 0. Сначала — юридический вопрос

Прежде чем заводить проект, нужно снять один вопрос с юристами Perfluence
и/или с Казахтелекомом:

> Закон РК «О персональных данных и их защите» требует хранить персональные
> данные граждан РК на территории Казахстана. Supabase Cloud дата-центров
> в Казахстане не имеет.

Варианты:
- **Supabase Cloud** (регион Frankfurt) — быстро, дёшево, но вопрос
  локализации остаётся открытым.
- **Self-hosted Supabase** на инфраструктуре Казахтелекома — снимает вопрос
  полностью. Весь код проекта при этом не меняется: меняются только
  `VITE_SUPABASE_URL` и ключи.

Разработку можно вести на Cloud и перенести на self-hosted перед боевым
запуском — миграции применяются те же самые. Но решение лучше принять
заранее, потому что перенос уже накопленных реальных заявок с персданными —
отдельная процедура.

---

## 1. Создать проект

1. https://supabase.com → New project.
2. Регион: **Frankfurt (eu-central-1)** — ближайший к Казахстану по задержке.
3. Сохранить пароль к базе в надёжном месте — Supabase показывает его один раз.

## 2. Применить миграции

Supabase Dashboard → **SQL Editor** → New query. Выполнить по одному файлу,
строго по порядку, каждый — отдельным запуском:

| Порядок | Файл | Что делает |
|---|---|---|
| 1 | `supabase/migrations/001_schema.sql` | Таблицы, enum статусов, индексы, триггеры |
| 2 | `supabase/migrations/002_rls.sql` | Политики доступа |
| 3 | `supabase/migrations/003_views.sql` | Витрины для отчётности |
| 4 | `supabase/migrations/004_seed.sql` | 4 тарифа из ТЗ + тестовые дилеры |

Если ставили Supabase CLI, вместо этого: `supabase db push`.

## 3. Проверить, что RLS действительно закрыл данные

Dashboard → **API Docs** или обычный curl. Подставьте свои URL и anon-ключ
(Settings → API):

```bash
curl "https://ВАШ-ПРОЕКТ.supabase.co/rest/v1/tariffs?select=slug,name_ru" -H "apikey: ВАШ_ANON_KEY"
```

Ожидаемо: 4 тарифа.

```bash
curl "https://ВАШ-ПРОЕКТ.supabase.co/rest/v1/leads?select=*" -H "apikey: ВАШ_ANON_KEY"
```

Ожидаемо: пустой массив `[]`. **Если здесь видны данные — RLS не применился,
дальше идти нельзя.**

## 4. Завести сотрудников

Публичной регистрации нет намеренно. Аккаунты создаёт админ:

1. Dashboard → **Authentication → Users → Add user** → email + пароль,
   отметить `Auto Confirm User`.
2. Скопировать `id` созданного пользователя.
3. SQL Editor:

```sql
insert into profiles (id, role, full_name)
values ('ВСТАВЬТЕ-UUID', 'admin', 'Имя Фамилия');
```

Роли: `admin` — всё, включая правку тарифов, дилеров и удаление заявок;
`manager` — видит и обрабатывает заявки, но ничего не удаляет.

## 5. Задать секреты Edge Function

Dashboard → **Settings → Edge Functions → Secrets** (или
`supabase secrets set КЛЮЧ=значение`):

| Секрет | Обязателен | Зачем |
|---|---|---|
| `ALLOWED_ORIGINS` | да, перед продом | Домены, с которых принимаются заявки, через запятую. Без него CORS открыт всем |
| `IP_HASH_SALT` | да | Соль для хеширования IP. Любая длинная случайная строка. Сам IP в базу не пишется |
| `TELEGRAM_BOT_TOKEN` | нет | Включает уведомления в Telegram |
| `TELEGRAM_CHAT_ID` | нет | Чат или группа для уведомлений |
| `LEAD_WEBHOOK_URL` | нет | Дублирование лида во внешнюю систему (CRM, n8n) |

`SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY` Supabase подставляет сам —
задавать вручную не нужно.

Пример генерации соли:

```bash
openssl rand -hex 32
```

## 6. Задеплоить функцию приёма заявок

```bash
supabase functions deploy submit-lead --no-verify-jwt
```

Флаг `--no-verify-jwt` обязателен: форму заполняет неавторизованный посетитель
лендинга, JWT у него нет. Безопасность здесь держится не на JWT, а на том, что
функция — единственная точка записи, с валидацией, honeypot и rate-limit.

## 7. Проверить приём заявки

```bash
curl -X POST "https://ВАШ-ПРОЕКТ.supabase.co/functions/v1/submit-lead" -H "Content-Type: application/json" -d '{"phone":"+7 707 123 45 67","full_name":"Тестов Тест","address":"Алматы, ул. Абая 1, кв. 2","tariff_slug":"bereket","dealer_code":"AG-K7F21","consent":true,"lang":"ru"}'
```

Ожидаемо: `{"ok":true}`, и в таблице `leads` появилась строка с заполненным
`dealer_id`.

Негативные проверки — каждая должна НЕ создать боевую заявку:

```bash
curl -X POST "https://ВАШ-ПРОЕКТ.supabase.co/functions/v1/submit-lead" -H "Content-Type: application/json" -d '{"phone":"123","full_name":"Т","address":"а","consent":true}'
```
Ожидаемо: `400 invalid_phone`.

```bash
curl -X POST "https://ВАШ-ПРОЕКТ.supabase.co/functions/v1/submit-lead" -H "Content-Type: application/json" -d '{"phone":"+77071234567","full_name":"Тестов Тест","address":"Алматы","consent":false}'
```
Ожидаемо: `400 consent_required`.

```bash
curl -X POST "https://ВАШ-ПРОЕКТ.supabase.co/functions/v1/submit-lead" -H "Content-Type: application/json" -d '{"phone":"+77071234567","full_name":"Бот","address":"Алматы","consent":true,"company":"spam"}'
```
Ожидаемо: `{"ok":true}`, но новой строки в `leads` нет — сработал honeypot.

Повторная отправка первого запроса в течение суток должна создать строку
со статусом `duplicate`.

## 8. Ключи для фронтенда

Создать `.env.local` в корне проекта:

```
VITE_SUPABASE_URL=https://ВАШ-ПРОЕКТ.supabase.co
VITE_SUPABASE_ANON_KEY=ваш_anon_key
```

Anon-ключ публичен по замыслу — он попадает в браузер. Защита данных
обеспечивается RLS, а не секретностью этого ключа. **`service_role` ключ
во фронтенд не попадает никогда** — он живёт только в секретах Edge Functions.
