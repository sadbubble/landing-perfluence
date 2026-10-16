<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import type { Lang } from "../composables/useLang";

/**
 * Шапка: переключатель языка и кнопка к тарифам.
 *
 * Лежит поверх баннера, а не над ним. Раньше это была обычная полоса в
 * потоке: белый прямоугольник упирался в тёмный баннер и резал его пополам
 * жёстким стыком. Теперь шапка плавающая и прозрачная, пока баннер на
 * экране, — баннер занимает окно целиком, без шва.
 *
 * Когда баннер уезжает вверх, шапка становится белой и в ней появляется
 * кнопка к тарифам: ниже по странице другого способа к ним вернуться нет.
 *
 * Плашки «Официальный партнёр АО «Казахтелеком»» здесь нет намеренно — по
 * решению заказчика она осталась только в подвале. Требование ТЗ п.3 при
 * этом выполняется: надпись присутствует на странице, см. SiteFooter.
 *
 * Логотипа и названия в шапке тоже нет по решению заказчика. Кнопка
 * «в начало» уехала вместе с ними: единственным её носителем был логотип,
 * а лендинг одностраничный — наверх ведёт прокрутка.
 */
defineProps<{
  langRu: string;
  langKz: string;
  lang: Lang;
  ctaLabel: string;
}>();

const emit = defineEmits<{
  cta: [];
  langChange: [lang: Lang];
}>();

const scrolled = ref(false);

// Высоту баннера меряем при монтировании и смене размера окна: чтение
// offsetHeight на каждом событии прокрутки заставляло бы браузер
// пересчитывать раскладку десятки раз в секунду.
let threshold = 400;
const check = () => {
  scrolled.value = window.scrollY > threshold;
};
const measure = () => {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (hero) threshold = hero.offsetHeight - 72;
  check();
};

onMounted(() => {
  measure();
  window.addEventListener("scroll", check, { passive: true });
  window.addEventListener("resize", measure);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", check);
  window.removeEventListener("resize", measure);
});
</script>

<template>
  <header :class="['site-header', { 'is-solid': scrolled }]">
    <div class="site-header-bar">
      <div :style="{ flex: 1 }" />

      <button v-if="scrolled" class="header-cta" @click="emit('cta')">
        {{ ctaLabel }}
      </button>

      <div class="lang-switch">
        <button
          :aria-pressed="lang === 'ru'"
          :class="['lang-btn', { 'is-active': lang === 'ru' }]"
          @click="emit('langChange', 'ru')"
        >
          {{ langRu }}
        </button>
        <button
          :aria-pressed="lang === 'kk'"
          :class="['lang-btn', { 'is-active': lang === 'kk' }]"
          @click="emit('langChange', 'kk')"
        >
          {{ langKz }}
        </button>
      </div>
    </div>
  </header>
</template>
