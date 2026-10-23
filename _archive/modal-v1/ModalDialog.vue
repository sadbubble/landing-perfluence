<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";

/**
 * Модальное окно для формы заявки.
 *
 * Сделано без библиотеки: нужен ровно один диалог на весь лендинг, а любой
 * готовый компонент притащил бы за собой пакет размером с саму форму.
 *
 * Что здесь обязательно и почему:
 *   • Esc закрывает — этого ждут от любого окна (пока курсор не внутри
 *     чужой рамки: её события клавиатуры до нас не доходят);
 *   • клик по затемнению закрывает, клик внутри — нет;
 *   • прокрутка страницы под окном блокируется, иначе фон уезжает под
 *     пальцем на телефоне;
 *   • фокус уходит внутрь при открытии и возвращается на кнопку при
 *     закрытии — без этого человек с клавиатуры теряется на странице;
 *   • Tab не выпускает фокус за пределы окна (кроме чужой рамки — её
 *     содержимое ловушке не видно).
 */
const props = defineProps<{
  open: boolean;
  closeLabel: string;
}>();

const emit = defineEmits<{ close: [] }>();

const panel = ref<HTMLDivElement | null>(null);
let returnFocus: HTMLElement | null = null;
let focusTimer: number | undefined;
let prevOverflow = "";
let prevPadding = "";

const focusable = () =>
  Array.from(
    panel.value?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])',
    ) ?? [],
  ).filter((el) => el.tabIndex >= 0 && el.offsetParent !== null);

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    e.preventDefault();
    emit("close");
    return;
  }
  if (e.key !== "Tab") return;
  const items = focusable();
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
};

function activate() {
  returnFocus = document.activeElement as HTMLElement | null;

  // Блокируем прокрутку, компенсируя ширину полосы прокрутки: без этого
  // страница под окном дёргается вбок в момент открытия.
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  prevOverflow = document.body.style.overflow;
  prevPadding = document.body.style.paddingRight;
  document.body.style.overflow = "hidden";
  if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

  document.addEventListener("keydown", onKeyDown);
  // Фокус на первый элемент после крестика: человек пришёл заполнять форму.
  focusTimer = window.setTimeout(() => {
    const items = focusable();
    (items[1] ?? items[0])?.focus();
  }, 60);
}

function deactivate() {
  document.removeEventListener("keydown", onKeyDown);
  window.clearTimeout(focusTimer);
  document.body.style.overflow = prevOverflow;
  document.body.style.paddingRight = prevPadding;
  returnFocus?.focus();
  returnFocus = null;
}

watch(
  () => props.open,
  (open, wasOpen) => {
    if (open && !wasOpen) activate();
    else if (!open && wasOpen) deactivate();
  },
);

onBeforeUnmount(() => {
  if (props.open) deactivate();
});
</script>

<template>
  <div v-if="open" class="modal-backdrop" @mousedown="emit('close')">
    <!-- Клик внутри не должен закрывать окно, а всплывает он до фона -->
    <div ref="panel" class="modal-panel" role="dialog" aria-modal="true" @mousedown.stop>
      <button type="button" class="modal-close" :aria-label="closeLabel" @click="emit('close')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>

      <slot />
    </div>
  </div>
</template>
