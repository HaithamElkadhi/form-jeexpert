"use client";

import { hintClass, inputClass, labelClass, optionRowClass } from "./fieldStyles";

interface BaseProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
}

function FieldShell({
  id,
  label,
  required,
  hint,
  children,
}: BaseProps & { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass} htmlFor={id}>
        {label}
        {required && <span className="text-italy-terracotta"> *</span>}
      </label>
      {children}
      {hint && <p className={hintClass}>{hint}</p>}
    </div>
  );
}

export function TextField({
  id,
  label,
  required,
  hint,
  value,
  onChange,
  type = "text",
  min,
  max,
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "email";
  min?: number;
  max?: number;
}) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint}>
      <input
        id={id}
        type={type}
        required={required}
        min={min}
        max={max}
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  required,
  hint,
  value,
  onChange,
  options,
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint}>
      <select
        id={id}
        required={required}
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Sélectionner…
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function RadioField({
  id,
  label,
  required,
  hint,
  value,
  onChange,
  options,
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className={labelClass}>
        {label}
        {required && <span className="text-italy-terracotta"> *</span>}
      </legend>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className={optionRowClass}>
            <input
              type="radio"
              name={id}
              required={required}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4 accent-italy-green"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {hint && <p className={hintClass}>{hint}</p>}
    </fieldset>
  );
}

export function MultiSelectField({
  id,
  label,
  required,
  hint,
  value,
  onChange,
  options,
  exclusiveValue,
}: BaseProps & {
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  /** If selected, clears all other options (e.g. "none") */
  exclusiveValue?: string;
}) {
  function toggle(opt: string) {
    if (exclusiveValue && opt === exclusiveValue) {
      onChange(value.includes(opt) ? [] : [exclusiveValue]);
      return;
    }
    let next = value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt];
    if (exclusiveValue) {
      next = next.filter((v) => v !== exclusiveValue);
    }
    onChange(next);
  }

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className={labelClass}>
        {label}
        {required && <span className="text-italy-terracotta"> *</span>}
      </legend>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className={optionRowClass}>
            <input
              type="checkbox"
              name={id}
              checked={value.includes(opt.value)}
              onChange={() => toggle(opt.value)}
              className="h-4 w-4 accent-italy-green"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {hint && <p className={hintClass}>{hint}</p>}
    </fieldset>
  );
}
