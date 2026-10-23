<script setup lang="ts">
import { computed } from "vue";
import type { Tariff } from "../content/ru";
import type { TariffSelection } from "../lib/qbox";
import TariffCard from "./TariffCard.vue";

/**
 * Секция тарифов.
 *
 * Выбор «с контрактом / без контракта» живёт в каждой карточке, а не на
 * всю секцию (решение заказчика, октябрь 2026): человек сравнивает режимы
 * у того тарифа, который ему интересен, и набор карточек больше не меняется
 * от вкладки к вкладке. Раньше на «С контрактом» было три карточки, на
 * «Без контракта» — четыре, и часть тарифов просто исчезала.
 */
const props = defineProps<{
  title: string;
  tariffs: Tariff[];
  connectLabel: string;
  currency: string;
  perMonthShort: string;
  toggleContract: string;
  toggleNoContract: string;
  savingLabel: string;
  priceModeHint: string;
  detailsMore: string;
  detailsLess: string;
}>();

const emit = defineEmits<{ select: [sel: TariffSelection] }>();

/*
 * Карточки: тарифы с одинаковым group собираются в одну (Keremet TV PROMO +
 * Keremet TV 2026), остальные идут по одному. Порядок — по первому тарифу
 * группы в данных.
 */
const cards = computed(() => {
  const groups = new Map<string, Tariff[]>();
  for (const t of props.tariffs) {
    const key = t.group ?? t.slug;
    const list = groups.get(key);
    if (list) list.push(t);
    else groups.set(key, [t]);
  }
  return Array.from(groups, ([key, offers]) => ({ key, offers }));
});
</script>

<template>
  <section id="tariffs" class="tariffs">
    <div class="tariffs-inner">
      <div class="tariffs-head reveal">
        <h2>{{ title }}</h2>
        <p>{{ priceModeHint }}</p>
      </div>

      <div class="tariffs-grid">
        <div
          v-for="(card, i) in cards"
          :key="card.key"
          class="reveal"
          :style="{ transitionDelay: `${i * 70}ms` }"
        >
          <TariffCard
            :offers="card.offers"
            :currency="currency"
            :per-month-short="perMonthShort"
            :saving-label="savingLabel"
            :details-more="detailsMore"
            :details-less="detailsLess"
            :contract-mode-label="toggleContract"
            :no-contract-mode-label="toggleNoContract"
            :mode-hint="priceModeHint"
            :connect-label="connectLabel"
            @select="emit('select', $event)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
