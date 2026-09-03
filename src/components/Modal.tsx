import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  children: React.ReactNode;
}

/**
 * Модальное окно для формы заявки.
 *
 * Сделано без библиотеки: нужен ровно один диалог на весь лендинг, а любой
 * готовый компонент притащил бы за собой пакет размером с саму форму.
 *
 * Что здесь обязательно и почему:
 *   • Esc закрывает — этого ждут от любого окна;
 *   • клик по затемнению закрывает, клик внутри — нет;
 *   • прокрутка страницы под окном блокируется, иначе фон уезжает под
 *     пальцем на телефоне;
 *   • фокус уходит внутрь при открытии и возвращается на кнопку при
 *     закрытии — без этого человек с клавиатуры теряется на странице;
 *   • Tab не выпускает фокус за пределы окна.
 */
export default function Modal({ open, onClose, closeLabel, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;

    // Блокируем прокрутку, компенсируя ширину полосы прокрутки: без этого
    // страница под окном дёргается вбок в момент открытия.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const focusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter(
        (el) =>
          // tabIndex < 0 отсекает скрытое поле-ловушку: селектор его не
          // ловит, а проверки на видимость оно проходит — лежит за экраном
          // через position/left, то есть offsetParent у него есть.
          // Попади туда фокус, человек с клавиатуры заполнил бы ловушку и
          // получил молчаливый отказ вместо отправленной заявки.
          el.tabIndex >= 0 && el.offsetParent !== null,
      );

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
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

    document.addEventListener("keydown", onKeyDown);
    // Фокус на первое поле, а не на крестик: человек пришёл заполнять форму.
    // Через ?? писать нельзя: focus() возвращает undefined и на успешном
    // вызове, поэтому запасная ветка срабатывала всегда и уводила фокус
    // обратно на крестик.
    const t = setTimeout(() => {
      const items = focusable();
      (items[1] ?? items[0])?.focus();
    }, 60);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      returnFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        ref={panelRef}
        /* Клик внутри не должен закрывать окно, а всплывает он до фона */
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label={closeLabel}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
}
