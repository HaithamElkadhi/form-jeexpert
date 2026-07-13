"use client";

import { FormEvent } from "react";
import { ItalyFormData, UpdateField } from "../types";
import { inputClass, labelClass } from "./fieldStyles";

interface Props {
  data: ItalyFormData;
  update: UpdateField;
  onNext: () => void;
}

export default function AboutYouStep({ data, update, onNext }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-gray-900">About you</h2>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="firstName">
          First name
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
          Last name
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
          Email
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
          Phone / WhatsApp
        </label>
        <input
          id="phone"
          type="tel"
          required
          className={inputClass}
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="birthday">
          Birthday
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
          Address
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
        <label className={labelClass} htmlFor="howHeard">
          How did you hear about us?
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
        Continue
      </button>
    </form>
  );
}
