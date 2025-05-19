let __rtfCache: Map<Intl.LocalesArgument, Intl.RelativeTimeFormat> | undefined;

function getRtf(locale?: Intl.LocalesArgument): Intl.RelativeTimeFormat {
  if (!__rtfCache) {
    __rtfCache = new Map<Intl.LocalesArgument, Intl.RelativeTimeFormat>();
  }

  let rtf = __rtfCache.get(locale);

  if (!rtf) {
    rtf = new Intl.RelativeTimeFormat(locale, {
      style: "long",
      numeric: "auto",
    });
    __rtfCache.set(locale, rtf);
  }
  return rtf;
}

export function howLongAgo(
  dateStr?: string | null,
  locale: string = navigator.language
): string {
  if (!dateStr) return "Unknown";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "Unknown";

  const now = Date.now();
  const diffMs = date.getTime() - now;
  const absMs = Math.abs(diffMs);
  const rtf = getRtf(locale);

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 1000 * 60 * 60 * 24 * 365.25],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["week", 1000 * 60 * 60 * 24 * 7],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000],
  ];

  for (const [unit, ms] of units) {
    if (absMs >= ms || unit === "second") {
      const value = Math.round(diffMs / ms);
      return rtf.format(value, unit);
    }
  }

  return rtf.format(0, "second");
}
