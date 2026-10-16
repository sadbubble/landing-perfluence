<script setup lang="ts">
import { computed, ref } from "vue";
import type { TariffPrice, SimVariant, TariffService } from "../content/ru";
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
 * У Bereket второй переключатель — 2 SIM / 4 SIM. Он нужен не для красоты:
 * в Qbox это разные продукты, и без него лендинг не мог сообщить форме,
 * какой из них выбрали. Раньше 4 SIM был строчкой текста под ценой, нажать
 * на неё было нельзя.
 */
const props = defineProps<{
  slug: string;
  name: string;
  tagline?: string | null;
  headline: string;
  /** Состав тарифа (ТЗ п.4). У Bereket берётся из выбранного варианта SIM. */
  services?: TariffService[] | null;
  price: TariffPrice;
  /** Варианты по числу SIM. Есть только у Bereket, у остальных null. */
  simVariants?: SimVariant[] | null;
  badge?: string | null;
  recommended?: boolean;
  connectLabel: string;
  currency: string;
  perMonthShort: string;
  savingLabel: string;
  /** «Подробнее» / «Свернуть» у блоков услуг с цифрами. */
  detailsMore: string;
  detailsLess: string;
  noContractLabel: string;
  mode: PriceMode;
}>();

const emit = defineEmits<{ select: [sel: TariffSelection] }>();

const simId = ref<string | null>(props.simVariants?.[0]?.id ?? null);

// Цена и строка сути берутся из выбранного варианта SIM, если он есть.
const variant = computed(() => props.simVariants?.find((v) => v.id === simId.value) ?? null);
const activePrice = computed(() => (variant.value ? variant.value.price : props.price));
const headlineParts = computed(() =>
  splitNumbers(variant.value ? variant.value.headline : props.headline),
);
// Состав: у Bereket свой на каждый вариант SIM, у остальных общий.
const activeServices = computed(() =>
  variant.value ? variant.value.services : (props.services ?? []),
);

/*
 * Цена строго из выбранного режима. Тариф без цены в этом режиме живёт
 * только на другой вкладке, и секция отбирает карточки заранее (см.
 * TariffsSection). null сюда попасть не должен — проверка лишь страховка.
 */
const showContract = computed(() => props.mode === "contract");
const amount = computed(() =>
  showContract.value ? activePrice.value.contract : activePrice.value.noContract,
);
const caption = computed(() =>
  showContract.value ? activePrice.value.contractLabel : props.noContractLabel,
);

/** «7 249» → 7249. Нужна только для подсчёта выгоды. */
const toNumber = (s: string) => Number(s.replace(/\D/g, ""));

// Выгоду можно посчитать, только если у тарифа есть обе цены.
const saving = computed(() => {
  const p = activePrice.value;
  return showContract.value && p.contract !== null && p.noContract !== null
    ? toNumber(p.noContract) - toNumber(p.contract)
    : 0;
});
</script>

<template>
  <article v-if="amount !== null" :class="['tcard', { 'is-popular': recommended }]">
    <span v-if="badge && recommended" class="tcard-pill">{{ badge }}</span>

    <h3 class="tcard-name">{{ name }}</h3>
    <span v-if="badge && !recommended" class="tcard-chip">{{ badge }}</span>
    <p class="tcard-headline">
      <template v-for="(part, i) in headlineParts" :key="i">
        <b v-if="part.bold">{{ part.text }}</b>
        <span v-else>{{ part.text }}</span>
      </template>
    </p>

    <div v-if="simVariants && simVariants.length > 1" class="tcard-sim" role="group" :aria-label="name">
      <button
        v-for="v in simVariants"
        :key="v.id"
        type="button"
        :class="['tcard-sim-btn', { 'is-active': v.id === simId }]"
        :aria-pressed="v.id === simId"
        @click="simId = v.id"
      >
        {{ v.label }}
      </button>
    </div>

    <!-- key заставляет цену перерисоваться при смене режима — иначе
         подмена суммы проходит незаметно. -->
    <div :key="amount" class="tcard-price">
      <span class="tcard-price-num">{{ amount }}</span>
      <span class="tcard-price-cur">{{ currency }}</span>
    </div>
    <div class="tcard-per">{{ perMonthShort }}</div>

    <div v-if="activeServices.length > 0" class="tcard-services">
      <ServiceBlock
        v-for="s in activeServices"
        :key="s.icon"
        :service="s"
        :more-label="detailsMore"
        :less-label="detailsLess"
      />
    </div>

    <span v-if="showContract && saving > 0" class="tcard-saving">
      −{{ saving.toLocaleString("ru-RU") }} {{ currency }} {{ savingLabel }}
    </span>
    <p v-if="caption" class="tcard-caption">{{ caption }}</p>

    <ul v-if="activePrice.extra.length > 0" class="tcard-extra">
      <li v-for="d in activePrice.extra" :key="d">{{ d }}</li>
    </ul>

    <!-- Прижимаем низ к одной линии: карточки разной высоты, иначе кнопки
         не выстроятся в ряд. -->
    <div class="tcard-foot">
      <p v-if="tagline" class="tcard-note">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        {{ tagline }}
      </p>

      <button class="tcard-btn" @click="emit('select', { slug, mode, sim: simId })">
        {{ connectLabel }}
      </button>
    </div>
  </article>
</template>
