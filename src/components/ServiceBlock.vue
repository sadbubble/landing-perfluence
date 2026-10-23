<script setup lang="ts">
import { computed, ref, useId } from "vue";
import type { TariffService } from "../content/ru";
import { splitNumbers } from "../lib/text";

/**
 * Блок услуги в составе тарифа: иконка, название, цифры.
 *
 * Если у блока есть цифры или условия (facts, details), всё ниже названия
 * прячется под «Подробнее». Так у мобильной связи Bereket: раскрытая, она
 * вытягивала карточку почти до 900px, а с ней весь ряд — высота карточек
 * в ряду общая. Кнопка 44px по высоте, как все цели под палец в проекте.
 *
 * Иконки свои, линейные, в цвет текста — не копия с сайта КТ. Неизвестное
 * имя иконки — блок без иконки.
 *
 * «∞» в цифрах рисуется иконкой: в урезанных файлах Helvetica Neue этого
 * знака нет, и браузер брал его из запасного шрифта — мелкий и бледный рядом
 * с жирными цифрами. Сам знак остаётся текстом для скринридеров.
 */
const props = defineProps<{
  service: TariffService;
  moreLabel: string;
  lessLabel: string;
}>();

const ICONS = ["internet", "tv", "mobile", "tablet", "watch", "gift"];

const open = ref(false);
const bodyId = useId();
const collapsible = computed(() => props.service.facts.length > 0 || props.service.details.length > 0);
const summaryParts = computed(() => splitNumbers(props.service.summary));
</script>

<template>
  <div class="tcard-service">
    <span v-if="ICONS.includes(service.icon)" class="tcard-service-icon" aria-hidden="true">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          v-if="service.icon === 'internet'"
          d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 16a5 5 0 0 1 6.8 0M12 19.5h.01"
        />
        <template v-else-if="service.icon === 'tv'">
          <rect x="2.5" y="4.5" width="19" height="12.5" rx="2" />
          <path d="M8 20.5h8" />
        </template>
        <!-- Планшет: шире телефона, кнопка снизу точкой -->
        <template v-else-if="service.icon === 'tablet'">
          <rect x="4" y="2.5" width="16" height="19" rx="2.2" />
          <path d="M12 18.5h.01" />
        </template>
        <template v-else-if="service.icon === 'watch'">
          <rect x="6.5" y="6.5" width="11" height="11" rx="2.6" />
          <path d="M9 6.5l.6-3.5h4.8l.6 3.5M9 17.5l.6 3.5h4.8l.6-3.5M12 9.8V12l1.5 1.2" />
        </template>
        <template v-else-if="service.icon === 'gift'">
          <rect x="3.5" y="8" width="17" height="4" rx="1" />
          <path d="M5 12v8.5h14V12M12 8v12.5" />
          <path d="M12 8C10.5 4.5 7 4.5 7.3 6.8 7.6 8 12 8 12 8zm0 0c1.5-3.5 5-3.5 4.7-1.2C16.4 8 12 8 12 8z" />
        </template>
        <template v-else>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.2" />
          <path d="M11 18.5h2" />
        </template>
      </svg>
    </span>

    <div class="tcard-service-body">
      <p class="tcard-service-title">{{ service.title }}</p>

      <div v-if="collapsible" :id="bodyId" :hidden="!open">
        <p v-if="service.summary" class="tcard-service-summary">
          <template v-for="(part, i) in summaryParts" :key="i">
            <b v-if="part.bold">{{ part.text }}</b>
            <span v-else>{{ part.text }}</span>
          </template>
        </p>
        <dl v-if="service.facts.length > 0" class="tcard-facts">
          <div v-for="f in service.facts" :key="f.value">
            <dt>
              <template v-if="f.value.startsWith('∞')">
                <svg class="tcard-inf" width="18" height="12" viewBox="0 0 24 16" fill="none" aria-hidden="true">
                  <path
                    d="M12 8C10 5.3 8.3 4 6.5 4a4 4 0 0 0 0 8c1.8 0 3.5-1.3 5.5-4zm0 0c2 2.7 3.7 4 5.5 4a4 4 0 0 0 0-8C15.7 4 14 5.3 12 8z"
                    stroke="currentColor"
                    stroke-width="2.2"
                  />
                </svg>
                <span class="visually-hidden">∞</span>{{ f.value.slice(1) }}
              </template>
              <template v-else>{{ f.value }}</template>
            </dt>
            <dd>{{ f.label }}</dd>
          </div>
        </dl>
        <ul v-if="service.details.length > 0" class="tcard-details">
          <li v-for="d in service.details" :key="d">{{ d }}</li>
        </ul>
      </div>

      <p v-else-if="service.summary" class="tcard-service-summary">
        <template v-for="(part, i) in summaryParts" :key="i">
          <b v-if="part.bold">{{ part.text }}</b>
          <span v-else>{{ part.text }}</span>
        </template>
      </p>

      <button
        v-if="collapsible"
        type="button"
        class="tcard-more"
        :aria-expanded="open"
        :aria-controls="bodyId"
        @click="open = !open"
      >
        {{ open ? lessLabel : moreLabel }}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>
</template>
