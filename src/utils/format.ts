import i18n from "@/i18n";

function activeLang(): string {
  return i18n.resolvedLanguage ?? "en";
}

function intlLocale(lng: string): string {
  return lng === "ar" ? "ar-EG" : "en-US";
}

function numberingSystem(lng: string): string {
  return lng === "ar" ? "arab" : "latn";
}

export function formatNumber(value: number, lng = activeLang()): string {
  return new Intl.NumberFormat(intlLocale(lng), {
    numberingSystem: numberingSystem(lng),
  }).format(value);
}

export function formatCurrency(value: number, lng = activeLang()): string {
  return new Intl.NumberFormat(intlLocale(lng), {
    style: "currency",
    currency: "EGP",
    numberingSystem: numberingSystem(lng),
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPriceRange(min: number, max: number, lng = activeLang()): string {
  if (min === max) return formatCurrency(min, lng);
  return `${formatCurrency(min, lng)} – ${formatCurrency(max, lng)}`;
}

export function formatDate(iso: string, lng = activeLang()): string {
  return new Intl.DateTimeFormat(intlLocale(lng), {
    year: "numeric",
    month: "short",
    day: "numeric",
    numberingSystem: numberingSystem(lng),
  }).format(new Date(iso));
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
