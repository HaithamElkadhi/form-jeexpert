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
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint}>
      <input
        id={id}
        type={type}
        required={required}
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldShell>
  );
}

export function TextareaField({
  id,
  label,
  required,
  hint,
  value,
  onChange,
}: BaseProps & { value: string; onChange: (value: string) => void }) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint}>
      <textarea
        id={id}
        required={required}
        rows={3}
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
}: BaseProps & { value: string; onChange: (value: string) => void; options: string[] }) {
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
          <option key={opt} value={opt}>
            {opt}
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
}: BaseProps & { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className={labelClass}>
        {label}
        {required && <span className="text-italy-terracotta"> *</span>}
      </legend>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {options.map((opt) => (
          <label key={opt} className={optionRowClass}>
            <input
              type="radio"
              name={id}
              required={required}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="h-4 w-4 accent-italy-green"
            />
            {opt}
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
}: BaseProps & {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
}) {
  function toggle(opt: string) {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  }

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className={labelClass}>
        {label}
        {required && <span className="text-italy-terracotta"> *</span>}
      </legend>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt} className={optionRowClass}>
            <input
              type="checkbox"
              name={id}
              checked={value.includes(opt)}
              onChange={() => toggle(opt)}
              className="h-4 w-4 accent-italy-green"
            />
            {opt}
          </label>
        ))}
      </div>
      {hint && <p className={hintClass}>{hint}</p>}
    </fieldset>
  );
}
