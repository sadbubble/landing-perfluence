<script setup lang="ts">
defineProps<{
  company: string;
  partnerBadge: string;
}>();
</script>

<template>
  <footer
    :style="{
      background: 'var(--footer-bg)',
      color: 'color-mix(in srgb, var(--footer-ink) 55%, transparent)',
      padding: '40px 20px',
    }"
  >
    <div
      class="footer-inner"
      :style="{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }"
    >
      <div class="footer-left" :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
        <span :style="{ color: 'var(--footer-ink)', fontWeight: 700, fontSize: '16px' }">
          {{ company }}
        </span>

        <!--
          Обязательная плашка об официальном партнёрстве (ТЗ п.3).

          Текст здесь --brand-light, а не основной --brand, хотя вокруг
          всё синее. Причина в замере: собственная подложка плашки
          (--brand 15% поверх подвала) осветляет фон до #08345C, и на нём
          --brand #008EFF даёт 3.81 при норме 4.5 — кегль 11px, послаблений
          для крупного текста тут не полагается. Обиднее всего, что без
          подложки тот же цвет проходит (4.67): её и не хватило.

          --brand-light #00D9FF на том же фоне даёт 7.47. Цвет из гайда
          заказчика («доп синий для градиента»), новых оттенков не заведено.

          Подложка намеренно осталась на --brand: она должна быть холоднее
          текста, иначе контраст просядет снова.
        -->
        <div
          :style="{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'color-mix(in srgb, var(--brand) 15%, transparent)',
            border: '1px solid color-mix(in srgb, var(--brand-light) 30%, transparent)',
            borderRadius: '6px',
            padding: '4px 10px',
            alignSelf: 'flex-start',
          }"
        >
          <div
            :style="{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--brand-light)',
            }"
          />
          <span
            :style="{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--brand-light)',
              letterSpacing: '0.2px',
            }"
          >
            {{ partnerBadge }}
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
