import me from "@/config/me.json";
import type { Locale } from "@/lib/locale";

export { me };

export function profileFor(locale: Locale) {
  return me.profile[locale];
}

export function hobbyFor(locale: Locale) {
  return me.hobby[locale];
}

export function metaFor(locale: Locale) {
  return me.meta[locale];
}

export { personJsonLd } from "./person-json-ld";
