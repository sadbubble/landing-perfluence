-- 002_rls.sql
-- Политики доступа. Базовый принцип: анонимный посетитель лендинга не может
-- прочитать ничего, кроме активных тарифов, и не может писать вообще ничего.
-- Заявки создаёт Edge Function submit-lead под service_role, который RLS обходит.

-- ---------------------------------------------------------------------------
-- Хелперы. security definer — чтобы политики на leads могли читать profiles,
-- не упираясь в RLS самой profiles (иначе получаем рекурсию политик).
-- ---------------------------------------------------------------------------
create or replace function is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin','manager')
  );
$$;

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table dealers             enable row level security;
alter table tariffs             enable row level security;
alter table leads               enable row level security;
alter table lead_status_history enable row level security;
alter table profiles            enable row level security;

-- ---------------------------------------------------------------------------
-- tariffs — единственное, что видит лендинг без авторизации.
-- ---------------------------------------------------------------------------
create policy "tariffs: активные видны всем"
  on tariffs for select
  to anon, authenticated
  using (is_active = true);

create policy "tariffs: правит только админ"
  on tariffs for all
  to authenticated
  using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- dealers — только сотрудники. Резолв кода дилера при отправке заявки
-- делает Edge Function под service_role, публичный доступ здесь не нужен.
-- ---------------------------------------------------------------------------
create policy "dealers: читают сотрудники"
  on dealers for select
  to authenticated
  using (is_staff());

create policy "dealers: правит только админ"
  on dealers for all
  to authenticated
  using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- leads — персональные данные. Никакого anon-доступа ни на чтение, ни на запись.
-- ---------------------------------------------------------------------------
create policy "leads: читают сотрудники"
  on leads for select
  to authenticated
  using (is_staff());

create policy "leads: обновляют сотрудники"
  on leads for update
  to authenticated
  using (is_staff()) with check (is_staff());

create policy "leads: удаляет только админ"
  on leads for delete
  to authenticated
  using (is_admin());

-- Задел под личный кабинет дилера (ТЗ этого не требует, но схема готова).
-- Раскомментировать, когда появится роль 'dealer' с привязкой profiles.dealer_id:
--
-- create policy "leads: дилер видит только свои"
--   on leads for select
--   to authenticated
--   using (
--     dealer_id = (select dealer_id from profiles where id = auth.uid())
--   );

-- ---------------------------------------------------------------------------
-- lead_status_history — только чтение сотрудниками. Пишет триггер.
-- ---------------------------------------------------------------------------
create policy "history: читают сотрудники"
  on lead_status_history for select
  to authenticated
  using (is_staff());

-- ---------------------------------------------------------------------------
-- profiles — свой профиль видит каждый (чтобы фронт узнал свою роль),
-- чужие и управление ролями — только админ.
-- ---------------------------------------------------------------------------
create policy "profiles: свой профиль"
  on profiles for select
  to authenticated
  using (id = auth.uid() or is_admin());

create policy "profiles: правит только админ"
  on profiles for all
  to authenticated
  using (is_admin()) with check (is_admin());
