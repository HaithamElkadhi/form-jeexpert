"use client";

import { FormEvent, useMemo, useState } from "react";
import { FlagIcon, PHONE_COUNTRIES } from "../phoneCountries";
import { ItalyFormData, UpdateField } from "../types";
import { inputClass, labelClass } from "./fieldStyles";

const NATIONALITY_OPTIONS = [
  "Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia",
  "Bosnia and Herzegovina","Botswana","Brazil","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi",
  "Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China",
  "Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czechia",
  "Denmark","Djibouti","Dominica","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
  "Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Honduras","Hungary",
  "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
  "Jamaica","Japan","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan",
  "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius",
  "Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
  "Oman",
  "Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar",
  "Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino",
  "Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore",
  "Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan",
  "Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
  "Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago",
  "Tunisia","Tunisian","Turkey","Turkmenistan","Tuvalu",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
  "Vanuatu","Vatican City","Venezuela","Vietnam",
  "Yemen",
  "Zambia","Zimbabwe",
];

interface Props {
  data: ItalyFormData;
  update: UpdateField;
  onNext: () => void;
}

export default function AboutYouStep({ data, update, onNext }: Props) {
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const selectedCountry =
    PHONE_COUNTRIES.find((country) => country.iso === data.phoneCountry) ?? PHONE_COUNTRIES[0];
  const visibleCountries = useMemo(() => {
    const query = countryQuery.trim().toLocaleLowerCase("fr");
    if (!query) return PHONE_COUNTRIES;
    return PHONE_COUNTRIES.filter(
      (country) =>
        country.label.toLocaleLowerCase("fr").includes(query) ||
        country.dial.includes(query) ||
        country.iso.toLocaleLowerCase("fr").includes(query)
    );
  }, [countryQuery]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-gray-900">À propos de vous</h2>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="firstName">
          Prénom
        </label>
        <input
          id="firstName"
          required
          className={inputClass}
          value={data.firstName}
          onChange={(e) => update("firstName", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="lastName">
          Nom
        </label>
        <input
          id="lastName"
          required
          className={inputClass}
          value={data.lastName}
          onChange={(e) => update("lastName", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="email">
          Adresse e-mail
        </label>
        <input
          id="email"
          type="email"
          required
          className={inputClass}
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="phone">
          Téléphone / WhatsApp
        </label>
        <div className="flex w-full items-stretch gap-2">
          <div className="relative shrink-0">
            <button
              type="button"
              aria-label="Indicatif pays"
              aria-expanded={countryOpen}
              onClick={() => setCountryOpen((open) => !open)}
              className="flex h-full w-[6.25rem] items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-2 text-sm text-gray-900"
            >
              <FlagIcon iso={selectedCountry.iso} />
              <span>{selectedCountry.dial}</span>
            </button>
            {countryOpen && (
              <div className="absolute left-0 z-20 mt-1 w-72 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="border-b border-gray-100 p-2">
                  <input
                    autoFocus
                    value={countryQuery}
                    onChange={(e) => setCountryQuery(e.target.value)}
                    placeholder="Pays ou indicatif"
                    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-italy-green"
                  />
                </div>
                <ul className="max-h-56 overflow-auto py-1">
                  {visibleCountries.map((country) => (
                    <li key={country.iso}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          update("phoneCountry", country.iso);
                          setCountryOpen(false);
                          setCountryQuery("");
                        }}
                      >
                        <FlagIcon iso={country.iso} />
                        <span className="min-w-0 flex-1 truncate">{country.label}</span>
                        <span className="text-gray-500">{country.dial}</span>
                      </button>
                    </li>
                  ))}
                  {visibleCountries.length === 0 && (
                    <li className="px-3 py-2 text-sm text-gray-500">Aucun pays</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <input
            id="phone"
            type="tel"
            required
            placeholder="20 000 000"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none transition-colors focus:border-italy-green focus:ring-1 focus:ring-italy-green"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="birthday">
          Date de naissance
        </label>
        <input
          id="birthday"
          type="date"
          required
          className={inputClass}
          value={data.birthday}
          onChange={(e) => update("birthday", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="address">
          Adresse
        </label>
        <input
          id="address"
          required
          className={inputClass}
          value={data.address}
          onChange={(e) => update("address", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="nationality">
          Nationalité
        </label>
        <select
          id="nationality"
          required
          className={inputClass}
          value={data.nationality}
          onChange={(e) => update("nationality", e.target.value)}
        >
          <option value="" disabled>
            Sélectionner
          </option>
          {NATIONALITY_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="howHeard">
          Comment nous avez-vous connus ?
        </label>
        <input
          id="howHeard"
          required
          className={inputClass}
          value={data.howHeard}
          onChange={(e) => update("howHeard", e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="mt-2 rounded-lg bg-italy-green px-6 py-3 font-medium text-white transition-colors hover:bg-italy-green-dark"
      >
        Continuer
      </button>
    </form>
  );
}
