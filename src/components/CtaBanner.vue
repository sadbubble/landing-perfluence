<script setup lang="ts">
/**
 * Нижний баннер вместо секции с формой.
 *
 * Собран по примерам из гайда заказчика (for landing.pdf, раздел 1):
 * сплошная фирменная синева, крупный заголовок с жёлтой подсветкой и одна
 * кнопка.
 *
 * Ряда «пилюль» с цифрами здесь намеренно нет: скорость и цену человек уже
 * прочитал в карточках тарифов выше, а повтор только удлинял баннер. По
 * той же причине заголовок не повторяет надпись на кнопке — он даёт повод
 * нажать, а не называет действие дважды.
 *
 * Кнопка открывает форму без тарифа — намеренно: баннер обещает «перезвоним
 * и подскажем» и существует для тех, кто тарифы смотреть не хочет.
 */
defineProps<{
  title: string;
  /** Слово под жёлтой подсветкой — приём из баннеров оператора. */
  accent: string;
  note: string;
  buttonLabel: string;
}>();

const emit = defineEmits<{ cta: [] }>();
</script>

<template>
  <section id="cta" class="cta-banner">
    <!-- Декоративные круги — тот же «сигнал», что и в верхнем баннере -->
    <svg class="cta-art" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1.5">
        <circle cx="1050" cy="200" r="120" />
        <circle cx="1050" cy="200" r="200" />
        <circle cx="1050" cy="200" r="290" />
      </g>
      <circle cx="1050" cy="200" r="7" fill="rgba(255,255,255,0.5)" />
    </svg>

    <div class="cta-inner reveal">
      <h2 class="cta-title">
        {{ title }} <span class="cta-accent">{{ accent }}</span>
      </h2>

      <button class="cta-btn" @click="emit('cta')">
        {{ buttonLabel }}
      </button>
      <p class="cta-note">{{ note }}</p>
    </div>
  </section>
</template>
