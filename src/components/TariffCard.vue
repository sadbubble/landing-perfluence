<script setup lang="ts">
import { computed, ref } from "vue";
import type { Tariff, TariffPrice } from "../content/ru";
import type { PriceMode, TariffSelection } from "../lib/qbox";
import { splitNumbers } from "../lib/text";
import ServiceBlock from "./ServiceBlock.vue";

/**
 * Карточка тарифа.
 *
 * Оформление — по макету заказчика: белая карточка, всё по центру, никаких
 * цветных шапок. Различает карточки не заливка, а сама цена: она здесь
 * самый крупный элемент, потому что за ней человек и пришёл.
 *
 * Рекомендуемый тариф выделяется синей рамкой и плашкой на верхнем крае —
 * приём из макета, заодно решает старую проблему: раньше выделение было
 * малозаметным.
 *
 * Выбор «с контрактом / без контракта» — в самой карточке, прямо над ценой,
 * которую он меняет. Режим определяет, какое название тарифа уйдёт в Qbox
 * (slug|mode|sim, см. lib/qbox.ts), поэтому он едет в select вместе с
 * тарифом. Если режим у тарифа один (Интернет 200), вместо кнопок надпись
 * той же высоты: нажимать там нечего, а ряд карточек остаётся ровным.
 *
 * Тарифов в карточке может быть два (offers) — когда они различаются только
 * режимом: Keremet TV PROMO с контрактом и Keremet TV 2026 без. Тогда режим
 * переключает сам тариф: название, состав и цену.
 *
 * У Bereket второй переключатель — 2 SIM / 4 SIM. Он нужен не для красоты:
 * в Qbox это разные продукты, и без него лендинг не мог сообщить форме,
 * какой из них выбрали.
 */
const props = defineProps<{
  /** Тарифы карточки: один или несколько, различающихся режимом (group). */
  offers: Tariff[];
  connectLabel: string;
  currency: string;
  perMonthShort: string;
  savingLabel: string;
  /** «Подробнее» / «Свернуть» у блоков услуг с цифрами. */
  detailsMore: string;
  detailsLess: string;
  /** Подписи режимов: «С контрактом» / «Без контракта». */
  contractModeLabel: string;
  noContractModeLabel: string;
  /** Подпись группы кнопок режима для экранных дикторов. */
  modeHint: string;
  /** «+ аренда оборудования» — её нет в цене, стоимость в примечании секции. */
  rentLabel: string;
}>();

const emit = defineEmits<{ select: [sel: TariffSelection] }>();

/** Все цены тарифа: у Bereket они лежат в вариантах SIM. */
const pricesOf = (t: Tariff): TariffPrice[] =>
  t.simVariants ? t.simVariants.map((v) => v.price) : [t.price];
const hasMode = (t: Tariff, m: PriceMode) => pricesOf(t).some((p) => p[m] !== null);

// Режимы, которые есть у карточки. Порядок задаёт кнопки и выбор по
// умолчанию: сначала «С контрактом» — цена ниже, её человек видит в рекламе.
const modes = computed(() =>
  (["contract", "noContract"] as const).filter((m) => props.offers.some((t) => hasMode(t, m))),
);
const mode = ref<PriceMode>(modes.value[0] ?? "contract");
const modeLabel = (m: PriceMode) =>
  m === "contract" ? props.contractModeLabel : props.noContractModeLabel;

// Тариф, который показывает карточка в выбранном режиме.
const offer = computed(() => props.offers.find((t) => hasMode(t, mode.value)) ?? props.offers[0]);

const simId = ref<string | null>(props.offers[0]?.simVariants?.[0]?.id ?? null);
const wideVariants = computed(() => offer.value.variantsLook === "wide");

// Цена и строка сути берутся из выбранного варианта SIM, если он есть.
const variant = computed(() => {
  const vs = offer.value.simVariants;
  if (!vs || vs.length === 0) return null;
  return vs.find((v) => v.id === simId.value) ?? vs[0];
});
const activePrice = computed(() => (variant.value ? variant.value.price : offer.value.price));
const headlineParts = computed(() =>
  splitNumbers(variant.value ? variant.value.headline : offer.value.headline),
);
// Состав: у Bereket свой на каждый вариант SIM, у остальных общий.
const activeServices = computed(() =>
  variant.value ? variant.value.services : (offer.value.services ?? []),
);

const showContract = computed(() => mode.value === "contract");
const amount = computed(() =>
  showContract.value ? activePrice.value.contract : activePrice.value.noContract,
);
// Срок контракта под ценой. Для «без контракта» подписи нет: режим и так
// написан на кнопке прямо над ценой.
const caption = computed(() => (showContract.value ? activePrice.value.contractLabel : null));

/** «7 249» → 7249. Нужна только для подсчёта выгоды. */
const toNumber = (s: string) => Number(s.replace(/\D/g, ""));

/*
 * Выгоду можно посчитать, только если у одного и того же тарифа есть обе
 * цены. У Keremet режимы — это разные тарифы (200 и 300 Мбит/с), и разница
 * их цен выгодой не является, поэтому там её нет.
 */
const saving = computed(() => {
  const p = activePrice.value;
  return showContract.value && p.contract !== null && p.noContract !== null
    ? toNumber(p.noContract) - toNumber(p.contract)
    : 0;
});

function select() {
  emit("select", { slug: offer.value.slug, mode: mode.value, sim: variant.value?.id ?? null });
}
</script>

<template>
  <article v-if="amount !== null" :class="['tcard', { 'is-popular': offer.recommended }]">
    <span v-if="offer.badge && offer.recommended" class="tcard-pill">{{ offer.badge }}</span>

    <h3 class="tcard-name">{{ offer.name }}</h3>
    <span v-if="offer.badge && !offer.recommended" class="tcard-chip">{{ offer.badge }}</span>
    <p class="tcard-headline">
      <template v-for="(part, i) in headlineParts" :key="i">
        <b v-if="part.bold">{{ part.text }}</b>
        <span v-else>{{ part.text }}</span>
      </template>
    </p>

    <!-- Вид выбора вариантов задаёт тариф: круглый переключатель (2/4 SIM)
         или крупные кнопки как у режима (Altel / Activ у Go Smart). -->
    <div
      v-if="offer.simVariants && offer.simVariants.length > 1"
      :class="wideVariants ? 'tcard-mode' : 'tcard-sim'"
      role="group"
      :aria-label="offer.name"
    >
      <button
        v-for="v in offer.simVariants"
        :key="v.id"
        type="button"
        :class="[wideVariants ? 'tcard-mode-btn' : 'tcard-sim-btn', { 'is-active': v.id === variant?.id }]"
        :aria-pressed="v.id === variant?.id"
        @click="simId = v.id"
      >
        {{ v.label }}
      </button>
    </div>

    <div v-if="modes.length > 1" class="tcard-mode" role="group" :aria-label="modeHint">
      <button
        v-for="m in modes"
        :key="m"
        type="button"
        :class="['tcard-mode-btn', { 'is-active': m === mode }]"
        :aria-pressed="m === mode"
        @click="mode = m"
      >
        {{ modeLabel(m) }}
      </button>
    </div>
    <p v-else class="tcard-mode is-single"><span>{{ modeLabel(mode) }}</span></p>

    <!-- key заставляет цену перерисоваться при смене режима — иначе
         подмена суммы проходит незаметно. -->
    <div :key="amount" class="tcard-price">
      <span class="tcard-price-num">{{ amount }}</span>
      <span class="tcard-price-cur">{{ currency }}</span>
    </div>
    <div class="tcard-per">{{ perMonthShort }}</div>
    <div class="tcard-rent">{{ rentLabel }}</div>

    <span v-if="saving > 0" class="tcard-saving">
      −{{ saving.toLocaleString("ru-RU") }} {{ currency }} {{ savingLabel }}
    </span>
    <p v-if="caption" class="tcard-caption">{{ caption }}</p>

    <div v-if="activeServices.length > 0" class="tcard-services">
      <ServiceBlock
        v-for="s in activeServices"
        :key="s.icon"
        :service="s"
        :more-label="detailsMore"
        :less-label="detailsLess"
      />
    </div>

    <ul v-if="activePrice.extra.length > 0" class="tcard-extra">
      <li v-for="d in activePrice.extra" :key="d">{{ d }}</li>
    </ul>

    <!-- Прижимаем низ к одной линии: карточки разной высоты, иначе кнопки
         не выстроятся в ряд. -->
    <div class="tcard-foot">
      <p v-if="offer.tagline" class="tcard-note">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        {{ offer.tagline }}
      </p>

      <button class="tcard-btn" @click="select">
        {{ connectLabel }}
      </button>
    </div>
  </article>
</template>
