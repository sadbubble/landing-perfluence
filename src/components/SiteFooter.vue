<script setup lang="ts">
/**
 * Подвал: компания и официальное партнёрство, условия, лицензии, оферта.
 *
 * «Официальный партнёр АО «Казахтелеком»» (ТЗ п.3) — с 27.10.2026 не
 * плашкой, а тем же белым жирным текстом рядом с «ТОО «Perfluence»» (слово
 * заказчика). Прежний вид с плашкой и разбор её контраста —
 * _archive/footer-v1/.
 *
 * Условия Back to School и лицензии — тексты заказчика дословно. Оферта
 * без адреса показывается текстом: ссылку на несуществующую страницу
 * ставить хуже, чем не ставить никакой.
 */
defineProps<{
  company: string;
  partnerBadge: string;
  info: {
    rent: string;
    btsTitle: string;
    btsItems: string[];
    licensesTitle: string;
    licenses: string[];
    offer: string;
    offerUrl: string | null;
    aiNote: string;
    copyright: string;
  };
}>();
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-top">
        <span class="footer-company">{{ company }}</span>
        <span class="footer-partner">{{ partnerBadge }}</span>
      </div>

      <p class="footer-rent">{{ info.rent }}</p>

      <div class="footer-cols">
        <section>
          <h3 class="footer-h">{{ info.btsTitle }}</h3>
          <ul class="footer-list">
            <li v-for="t in info.btsItems" :key="t">{{ t }}</li>
          </ul>
        </section>
        <section>
          <h3 class="footer-h">{{ info.licensesTitle }}</h3>
          <ul class="footer-list">
            <li v-for="t in info.licenses" :key="t">{{ t }}</li>
          </ul>
        </section>
      </div>

      <div class="footer-bottom">
        <a v-if="info.offerUrl" :href="info.offerUrl" target="_blank" rel="noopener">{{ info.offer }}</a>
        <span v-else>{{ info.offer }}</span>
        <span>{{ info.aiNote }}</span>
        <span>{{ info.copyright }}</span>
      </div>
    </div>
  </footer>
</template>
