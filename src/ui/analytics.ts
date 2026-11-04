/**
 * Privacy-friendly analytics with explicit opt-in. Nothing is loaded or sent
 * unless a provider, site id and script URL are all configured in content.ts.
 */

export type AnalyticsEvent =
  | "quick_view_open"
  | "resume_download"
  | "project_open"
  | "contact_click";

type Provider = "plausible" | "umami";

type AnalyticsConfig = {
  provider: "" | Provider;
  id: string;
  scriptUrl: string;
};

type Plausible = ((event: string) => void) & { q?: unknown[][] };
type Umami = { track?: (event: string) => void };

declare global {
  interface Window {
    plausible?: Plausible;
    umami?: Umami;
  }
}

const EVENT_NAMES = new Set<string>([
  "quick_view_open",
  "resume_download",
  "project_open",
  "contact_click",
]);

let provider: Provider | null = null;
let ready = false;
let pending: AnalyticsEvent[] = [];

function send(event: AnalyticsEvent): void {
  if (provider === "plausible") {
    window.plausible?.(event);
  } else if (provider === "umami") {
    window.umami?.track?.(event);
  }
}

export function initAnalytics(config: AnalyticsConfig): boolean {
  if (!config.provider || !config.id.trim() || !config.scriptUrl.trim()) return false;

  let url: URL;
  try {
    url = new URL(config.scriptUrl, window.location.href);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return false;

  provider = config.provider;
  if (provider === "plausible" && !window.plausible) {
    const queued = ((event: string) => {
      (queued.q ??= []).push([event]);
    }) as Plausible;
    window.plausible = queued;
  }

  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = url.href;
  script.dataset.analytics = provider;
  if (provider === "plausible") script.dataset.domain = config.id;
  else script.dataset.websiteId = config.id;
  script.addEventListener(
    "load",
    () => {
      ready = true;
      const queued = pending;
      pending = [];
      for (const event of queued) send(event);
    },
    { once: true },
  );
  document.head.appendChild(script);

  return true;
}

export function trackEvent(name: string): void {
  if (!provider || !EVENT_NAMES.has(name)) return;
  const event = name as AnalyticsEvent;
  if (!ready) {
    pending.push(event);
    return;
  }
  send(event);
}
