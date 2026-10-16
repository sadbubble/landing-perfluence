<script setup lang="ts">
import { computed, ref } from "vue";
import type { Tariff } from "../content/ru";
import type { PriceMode, TariffSelection } from "../lib/qbox";
import TariffCard from "./TariffCard.vue";

/**
 * Секция тарифов с переключателем «с контрактом / без контракта».
 *
 * Переключатель не украшение: у трёх из четырёх тарифов две разные цены,
 * и раньше обе лежали мелким текстом под карточкой — человек должен был
 * сам сравнивать. Теперь крупная цена меняется, а рядом появляется
 * посчитанная выгода, то есть выбор виден, а не вычисляется.
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

// По умолчанию показываем цену с контрактом: она ниже, и именно её
// человек видит в рекламе у блогера.
const mode = ref<PriceMode>("contract");

/*
 * Переключали ли уже вкладку. Нужно ради анимации появления: useReveal
 * собирает элементы .reveal один раз при загрузке, и карточка, появившаяся
 * после переключения (Интернет 200, Keremet TV 2026), так и осталась бы с
 * прозрачностью 0. Раз человек нажал переключатель, секцию он уже видит —
 * новые карточки показываем сразу.
 */
const switched = ref(false);
function choose(m: PriceMode) {
  mode.value = m;
  switched.value = true;
}

/*
 * На каждой вкладке свой набор: тариф показывается, только если у него
 * есть цена в этом режиме. У Bereket цены лежат в вариантах SIM.
 */
const visible = computed(() =>
  props.tariffs.filter((t) => {
    const prices = t.simVariants ? t.simVariants.map((v) => v.price) : [t.price];
    return prices.some((p) => (mode.value === "contract" ? p.contract : p.noContract) !== null);
  }),
);
</script>

<template>
  <section id="tariffs" class="tariffs">
    <div class="tariffs-inner">
      <div class="tariffs-head reveal">
        <h2>{{ title }}</h2>

        <div class="price-toggle" role="group" :aria-label="priceModeHint">
          <button
            :class="['price-toggle-btn', { 'is-active': mode === 'contract' }]"
            :aria-pressed="mode === 'contract'"
            @click="choose('contract')"
          >
            {{ toggleContract }}
          </button>
          <button
            :class="['price-toggle-btn', { 'is-active': mode === 'noContract' }]"
            :aria-pressed="mode === 'noContract'"
            @click="choose('noContract')"
          >
            {{ toggleNoContract }}
          </button>
        </div>
        <p class="price-toggle-hint">{{ priceModeHint }}</p>
      </div>

      <!-- Число карточек в классе: сетка подстраивает колонки под 3 или 4 -->
      <div :class="`tariffs-grid is-${visible.length}`">
        <div
          v-for="(tariff, i) in visible"
          :key="tariff.slug"
          :class="['reveal', { 'is-visible': switched }]"
          :style="{ transitionDelay: switched ? '0ms' : `${i * 70}ms` }"
        >
          <TariffCard
            v-bind="tariff"
            :mode="mode"
            :currency="currency"
            :per-month-short="perMonthShort"
            :saving-label="savingLabel"
            :details-more="detailsMore"
            :details-less="detailsLess"
            :no-contract-label="toggleNoContract"
            :connect-label="connectLabel"
            @select="emit('select', $event)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
