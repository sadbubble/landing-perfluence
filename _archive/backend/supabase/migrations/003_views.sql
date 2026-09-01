-- 003_views.sql
-- Витрины под отчётность (ТЗ п.7).
-- security_invoker = true — критично: без него view выполняется от владельца
-- и обходит RLS, то есть любой залогиненный получил бы все персданные.

-- ---------------------------------------------------------------------------
-- v_leads_report — плоская выгрузка, поля один в один из ТЗ п.7:
-- дилер, номер клиента, ФИО клиента, тариф, дата заявки, дата подключения, статус.
-- ---------------------------------------------------------------------------
create or replace view v_leads_report
with (security_invoker = true) as
select
  l.id,
  l.created_at,
  (l.created_at at time zone 'Asia/Almaty')::date  as lead_date,
  coalesce(d.full_name, '— не определён —')        as dealer_name,
  coalesce(d.code, l.dealer_code_raw)              as dealer_code,
  l.phone                                          as client_phone,
  l.full_name                                      as client_name,
  l.address                                        as client_address,
  t.name_ru                                        as tariff_name,
  t.slug                                           as tariff_slug,
  l.connected_at,
  l.status,
  case l.status
    when 'new'         then 'Новая'
    when 'in_progress' then 'В работе'
    when 'sale'        then 'Продажа'
    when 'refused'     then 'Отказ'
    when 'no_answer'   then 'Недозвон'
    when 'duplicate'   then 'Дубликат'
  end                                              as status_label,
  l.utm_source,
  l.utm_campaign,
  l.page_lang,
  l.manager_note
from leads l
left join dealers d on d.id = l.dealer_id
left join tariffs t on t.id = l.tariff_id;

-- ---------------------------------------------------------------------------
-- v_dealer_monthly — «сколько подтверждённых продаж сформировал каждый дилер»
-- за отчётный месяц. Месяц считается по времени Алматы, а не UTC, иначе
-- заявки, поданные вечером последнего числа, уедут в следующий месяц.
-- ---------------------------------------------------------------------------
create or replace view v_dealer_monthly
with (security_invoker = true) as
select
  date_trunc('month', l.created_at at time zone 'Asia/Almaty')::date as month,
  l.dealer_id,
  coalesce(d.code, l.dealer_code_raw, '—')  as dealer_code,
  coalesce(d.full_name, '— не определён —') as dealer_name,
  count(*)                                                     as leads_total,
  count(*) filter (where l.status = 'sale')                    as sales,
  count(*) filter (where l.status = 'refused')                 as refused,
  count(*) filter (where l.status = 'no_answer')               as no_answer,
  count(*) filter (where l.status = 'duplicate')               as duplicates,
  count(*) filter (where l.status in ('new','in_progress'))    as in_work,
  -- конверсия считается от заявок без дубликатов: дубликат не вина дилера,
  -- но и в базу расчёта попадать не должен
  round(
    100.0 * count(*) filter (where l.status = 'sale')
    / nullif(count(*) filter (where l.status <> 'duplicate'), 0)
  , 1) as conversion_pct
from leads l
left join dealers d on d.id = l.dealer_id
group by 1, 2, 3, 4;
