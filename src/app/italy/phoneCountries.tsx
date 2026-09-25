import * as Flags from "country-flag-icons/react/3x2";
import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js/min";

const regionNames = new Intl.DisplayNames(["fr"], { type: "region" });

export const PHONE_COUNTRIES = getCountries()
  .filter((iso): iso is CountryCode => iso in Flags)
  .map((iso) => ({
    iso,
    dial: `+${getCountryCallingCode(iso)}`,
    label: regionNames.of(iso) ?? iso,
  }))
  .sort((a, b) => a.label.localeCompare(b.label, "fr"));

export function dialCodeFor(iso: string): string {
  const country = PHONE_COUNTRIES.find((item) => item.iso === iso);
  return country?.dial ?? "";
}

export function FlagIcon({ iso }: { iso: string }) {
  const Icon = Flags[iso as keyof typeof Flags];
  if (typeof Icon !== "function") return null;
  return (
    <Icon
      className="h-3.5 w-5 shrink-0 rounded-[2px] border border-black/15"
      aria-hidden
    />
  );
}
