<script setup lang="ts">
import { withBase } from "../lib/base";

interface Step {
  number: string;
  title: string;
  description: string;
  /**
   * Круглый медальон шага. Пока файла нет, остаётся крупный номер шага —
   * секция цела.
   */
  image?: string;
}

defineProps<{
  title: string;
  subtitle: string;
  steps: Step[];
}>();
</script>

<template>
  <section class="how">
    <div :style="{ maxWidth: '1200px', margin: '0 auto' }">
      <div class="reveal" :style="{ textAlign: 'center', marginBottom: '52px' }">
        <h2
          :style="{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 800,
            color: 'var(--ink)',
            letterSpacing: '-0.3px',
            marginBottom: '12px',
          }"
        >
          {{ title }}
        </h2>
        <p :style="{ fontSize: '16px', color: 'var(--ink-muted)' }">{{ subtitle }}</p>
      </div>

      <div
        class="steps-grid"
        :style="{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
          position: 'relative',
        }"
      >
        <div
          v-for="(step, index) in steps"
          :key="step.number"
          class="reveal"
          :style="{ transitionDelay: `${index * 90}ms`, display: 'flex' }"
        >
          <div class="step">
            <div class="step-art-wrap">
              <!-- Фоном, а не <img>: изображение декоративно, а при отсутствии
                   файла фон просто не рисуется — остаётся номер шага. -->
              <div
                v-if="step.image"
                class="step-art"
                :style="{ backgroundImage: `url(${withBase(step.image)})` }"
                aria-hidden="true"
              />
              <div v-else class="step-art step-art-empty" aria-hidden="true" />
              <span class="step-num">{{ step.number }}</span>
            </div>

            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-text">{{ step.description }}</p>

            <!-- Пунктир к следующему шагу — только на широком экране, где шаги
                 стоят в ряд. В колонке он вёл бы вбок, в пустоту. -->
            <span v-if="index !== steps.length - 1" class="step-link" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
