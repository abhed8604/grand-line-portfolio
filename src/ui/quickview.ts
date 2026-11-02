import type { BuiltUI } from "./build";

export interface QuickViewOptions {
  reducedMotion: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface QuickViewController {
  open(): void;
  close(): void;
  isOpen(): boolean;
  destroy(): void;
}

export function initQuickView(
  ui: BuiltUI,
  options: QuickViewOptions,
): QuickViewController {
  const dialog = ui.quickView;
  const scroll = dialog.querySelector<HTMLElement>(".quickview__scroll");
  let restoreFocus: HTMLElement | null = null;
  let closeNotified = false;

  const isOpen = (): boolean => dialog.open || dialog.hasAttribute("open");

  const open = (): void => {
    if (isOpen()) return;
    restoreFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeNotified = false;
    document.body.classList.add("quickview-open");
    if (scroll) scroll.scrollTop = 0;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    options.onOpen?.();
    const closeButton = dialog.querySelector<HTMLElement>("[data-close-quick]");
    closeButton?.focus({ preventScroll: true });
  };

  const finalizeClose = (): void => {
    if (closeNotified) return;
    closeNotified = true;
    document.body.classList.remove("quickview-open");
    options.onClose?.();
    if (restoreFocus?.isConnected) {
      restoreFocus.focus({ preventScroll: true });
    }
    restoreFocus = null;
  };

  const close = (): void => {
    if (!isOpen()) return;
    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      finalizeClose();
    }
  };

  const onClick = (event: MouseEvent): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest("[data-quick-view], [data-open-quick]")) {
      event.preventDefault();
      open();
      return;
    }
    if (target.closest("[data-close-quick]")) {
      event.preventDefault();
      close();
      return;
    }
    if (target === dialog) {
      close();
      return;
    }
    const anchor = target.closest<HTMLAnchorElement>('a[href^="#qv-"]');
    if (anchor && scroll) {
      const id = anchor.getAttribute("href")?.slice(1);
      const section = id ? document.getElementById(id) : null;
      if (section) {
        event.preventDefault();
        scroll.scrollTo({
          top: section.offsetTop - 8,
          behavior: options.reducedMotion ? "auto" : "smooth",
        });
      }
    }
  };

  const onCancel = (event: Event): void => {
    event.preventDefault();
    close();
  };

  const onClosed = (): void => {
    finalizeClose();
  };

  document.addEventListener("click", onClick);
  dialog.addEventListener("cancel", onCancel);
  dialog.addEventListener("close", onClosed);

  return {
    open,
    close,
    isOpen,
    destroy() {
      document.removeEventListener("click", onClick);
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClosed);
    },
  };
}
