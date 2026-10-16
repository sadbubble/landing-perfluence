<script setup lang="ts">
import { withBase } from "../lib/base";

/**
 * Баннер на первый экран.
 *
 * Занимает всю высоту окна и служит обложкой лендинга: человек приходит сюда
 * по рекламной ссылке блогера и за пару секунд должен понять, что предлагают
 * и что делать дальше.
 *
 * Композиция собрана вёрсткой: заливка, графика и текст. Фотография —
 * необязательный слой через --hero-image, и она именно фон, а не вырезанная
 * фигура. Текст при этом остаётся чётким и переключается на казахский.
 *
 * Высота задана в svh, а не vh: на мобильных vh считается по развёрнутому
 * окну, и низ баннера вместе с кнопкой уезжает под панель браузера.
 *
 * Кнопка одна: вторая («Смотреть тарифы») была дословным двойником главной —
 * обе ведут к тарифам. Стрелка внизу баннера ведёт туда же.
 */
defineProps<{
  /**
   * Связка «логотип Казахтелекома | Официальный партнёр» над заголовком.
   *
   * ТЗ п.3 требует и указания партнёрства, и «согласованного логотипа».
   * Логотип — официальный файл заказчика (assets-src/logo_latin/white.png),
   * не перерисованный и не сгенерированный. Текстовая плашка с полной
   * фразой осталась в подвале.
   */
  partnerLabel: string;
  logoAlt: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  imageAlt: string;
  /** Опорные факты под кнопкой: «Подключение за 1–2 дня» и подобные. */
  highlights: string[];
  scrollHint: string;
}>();

const emit = defineEmits<{ cta: [] }>();

const logoSrc = withBase("/kt-logo-white.png");
</script>

<template>
  <section class="hero" :aria-label="imageAlt">
    <!--
      Слой фоновой картинки (--hero-image). Экран телевизора на ней
      «включён» скриптом scripts/hero-image.py — см. docs/hero-image.md.
    -->
    <div class="hero-photo" aria-hidden="true" />

    <!-- Затемнение: без него текст на светлых участках фона нечитаем -->
    <div class="hero-scrim" aria-hidden="true" />

    <!-- Концентрические круги — «сигнал», держат правую часть композиции -->
    <svg class="hero-art" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hero-arc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="var(--brand)" stop-opacity="0.55" />
          <stop offset="100%" stop-color="var(--brand)" stop-opacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#hero-arc)">
        <circle cx="1180" cy="240" r="180" stroke-width="1.5" />
        <circle cx="1180" cy="240" r="300" stroke-width="1.5" />
        <circle cx="1180" cy="240" r="440" stroke-width="1.5" />
        <circle cx="1180" cy="240" r="600" stroke-width="1.5" />
      </g>
      <circle cx="1180" cy="240" r="10" fill="var(--brand)" opacity="0.7" />
    </svg>

    <div class="hero-inner">
      <div class="hero-copy">
        <p class="hero-partner">
          <img class="hero-partner-logo" :src="logoSrc" :alt="logoAlt" width="475" height="72" />
          <span class="hero-partner-sep" aria-hidden="true" />
          <span class="hero-partner-text">{{ partnerLabel }}</span>
        </p>
        <h1 class="hero-title">{{ title }}</h1>
        <p class="hero-subtitle">{{ subtitle }}</p>

        <div class="hero-actions">
          <button class="hero-btn hero-btn-primary" @click="emit('cta')">
            {{ ctaLabel }}
          </button>
        </div>

        <ul class="hero-highlights">
          <li v-for="h in highlights" :key="h">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8.5 L6.3 11.8 L13 5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ h }}
          </li>
        </ul>
      </div>
    </div>

    <button class="hero-scroll" :aria-label="scrollHint" @click="emit('cta')">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </section>
</template>
