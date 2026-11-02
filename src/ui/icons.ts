type IconName =
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "arrow-up-right"
  | "close"
  | "copy"
  | "download"
  | "external"
  | "compass";

const paths: Record<IconName, string> = {
  "arrow-down": '<path d="M12 4v15M6 13l6 6 6-6"/>',
  "arrow-left": '<path d="M20 12H5M11 6l-6 6 6 6"/>',
  "arrow-right": '<path d="M4 12h15M13 6l6 6-6 6"/>',
  "arrow-up-right": '<path d="M7 17 17 7M8 7h9v9"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  copy:
    '<rect x="8" y="8" width="11" height="11" rx="1"/><path d="M16 8V5H5v11h3"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
  external: '<path d="M14 4h6v6M20 4 10 14"/><path d="M19 14v5H5V5h5"/>',
  compass:
    '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
};

export function icon(name: IconName, className = ""): string {
  return `<svg class="icon ${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
}

export function ledMark(): string {
  const lit = new Set([0, 1, 2, 3, 5, 6, 7]);
  return `<span class="led-mark" aria-hidden="true">${Array.from({ length: 9 }, (_, index) => `<i class="${lit.has(index) ? "is-lit" : ""}" style="--i:${index}"></i>`).join("")}</span>`;
}
