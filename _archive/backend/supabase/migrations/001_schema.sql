-- 001_schema.sql
-- Лендинг Perfluence (партнёр АО «Казахтелеком») — базовая схема.
-- Применять в Supabase SQL Editor по порядку: 001 -> 002 -> 003 -> 004.

create extension if not exists pgcrypto;

-- Статусы обработки лида (ТЗ п.7).
create type lead_status as enum (
  'new',          -- новая, не в работе
  'in_progress',  -- в работе
  'sale',         -- продажа состоялась
  'refused',      -- отказ
  'no_answer',    -- недозвон
  'duplicate'     -- дубликат
);

-- ---------------------------------------------------------------------------
-- Дилеры / блогеры. code — то, что попадает в персональную ссылку /d/<code>.
-- ---------------------------------------------------------------------------
create table dealers (
  id         uuid primary key default gen_random_uuid(),
  code       text not null unique,
  full_name  text not null,
  phone      text,
  channel    text,                                  -- 'dealer' | 'blogger' | ...
  note       text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

comment on column dealers.code is 'Идентификатор в персональной ссылке, например AG-K7F21';

-- ---------------------------------------------------------------------------
-- Тарифы. Контент хранится в БД, чтобы цены менялись без передеплоя.
-- ---------------------------------------------------------------------------
create table tariffs (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  sort_order     int  not null default 0,
  is_active      boolean not null default true,
  name_ru        text not null,
  name_kk        text not null,
  description_ru text,
  description_kk text,
  price_note_ru  text,                               -- «Без контракта — 7 999 ₸/мес.»
  price_note_kk  text,
  price_from     int,                                -- минимальная цена, ₸/мес — для сортировки
  badge_ru       text,                               -- «Акция», «Хит» и т.п.
  badge_kk       text
);

-- ---------------------------------------------------------------------------
-- Заявки. Пишутся ТОЛЬКО из Edge Function submit-lead (service_role).
-- ---------------------------------------------------------------------------
create table leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  -- атрибуция дилера
  dealer_id       uuid references dealers(id) on delete set null,
  dealer_code_raw text,          -- код как он пришёл в ссылке, даже если неизвестен

  -- содержимое заявки
  tariff_id       uuid references tariffs(id) on delete set null,
  phone           text not null, -- нормализованный, всегда +7XXXXXXXXXX
  full_name       text not null,
  address         text not null,
  comment         text,

  -- обработка
  status          lead_status not null default 'new',
  connected_at    date,          -- дата подключения, заполняется при статусе 'sale'
  processed_by    uuid references auth.users(id) on delete set null,
  manager_note    text,

  -- согласие на обработку персональных данных (закон РК «О персональных данных»)
  consent         boolean not null default false,
  consent_version text,
  consent_at      timestamptz,

  -- технические метки источника
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  page_lang       text,          -- 'ru' | 'kk'
  user_agent      text,
  ip_hash         text,          -- sha256(ip + соль), сам IP не храним

  updated_at      timestamptz not null default now()
);

create index leads_dealer_created_idx on leads (dealer_id, created_at desc);
create index leads_created_idx        on leads (created_at desc);
create index leads_status_idx         on leads (status);
create index leads_phone_idx          on leads (phone);
create index leads_ip_hash_idx        on leads (ip_hash, created_at desc);

-- ---------------------------------------------------------------------------
-- История смены статусов — нужна для разбора спорных начислений дилерам.
-- ---------------------------------------------------------------------------
create table lead_status_history (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references leads(id) on delete cascade,
  old_status lead_status,
  new_status lead_status not null,
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now(),
  note       text
);

create index lead_status_history_lead_idx on lead_status_history (lead_id, changed_at desc);

-- ---------------------------------------------------------------------------
-- Роли сотрудников. Аккаунты заводит админ, публичной регистрации нет.
-- dealer_id — задел под личный кабинет дилера (сейчас не используется).
-- ---------------------------------------------------------------------------
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'manager' check (role in ('admin','manager','dealer')),
  dealer_id  uuid references dealers(id) on delete set null,
  full_name  text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Триггеры
-- ---------------------------------------------------------------------------

-- updated_at
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger leads_set_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- Любая смена статуса пишется в историю автоматически, чтобы админка
-- не могла «забыть» это сделать.
create or replace function log_lead_status_change() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status is distinct from old.status then
    insert into lead_status_history (lead_id, old_status, new_status, changed_by, note)
    values (new.id, old.status, new.status, auth.uid(), new.manager_note);
  end if;
  return new;
end;
$$;

create trigger leads_log_status_change
  after update on leads
  for each row execute function log_lead_status_change();
