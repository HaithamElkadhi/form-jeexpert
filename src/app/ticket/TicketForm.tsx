"use client";

import { FormEvent, useEffect, useState } from "react";
import { inputClass, labelClass } from "./components/fieldStyles";

type Phase = "form" | "success";

export default function TicketForm() {
  const [phase, setPhase] = useState<Phase>("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketRef, setTicketRef] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const res = await fetch("/api/ticket-categories");
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json.error || "Could not load categories.");
        }
        const list = Array.isArray(json.categories)
          ? json.categories.filter((c: unknown): c is string => typeof c === "string")
          : [];
        if (!cancelled) setCategories(list);
      } catch (err) {
        if (!cancelled) {
          setCategoriesError(
            err instanceof Error ? err.message : "Could not load categories."
          );
        }
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!category) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/submit-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          category,
          description: description.trim(),
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      setTicketRef(typeof json.ticketRef === "string" ? json.ticketRef : null);
      setPhase("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white p-8">
        {phase === "success" ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <svg width="80" height="80" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
              <circle
                className="checkmark-circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
                stroke="#3B6D11"
                strokeWidth="2"
              />
              <path
                className="checkmark-check"
                fill="none"
                stroke="#3B6D11"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900">Ticket submitted</h2>
            <p className="max-w-xs text-gray-600">
              Our team has received your request and will follow up soon.
            </p>
            {ticketRef ? (
              <p className="mt-2 rounded-lg bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900">
                Reference: <span className="font-semibold">{ticketRef}</span>
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Keep an eye on your email for updates from our team.
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setPhase("form");
                setFullName("");
                setEmail("");
                setPhone("");
                setCategory("");
                setDescription("");
                setTicketRef(null);
                setError(null);
              }}
              className="mt-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Submit another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-italy-green">JEExpert</p>
              <h1 className="text-2xl font-semibold text-gray-900">Ticket support</h1>
              <p className="text-sm text-gray-600">
                Tell us what you need help with. We&apos;ll create a task for our team.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                required
                className={inputClass}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                required
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="category">
                Category
              </label>
              <select
                id="category"
                required
                className={inputClass}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={categoriesLoading || Boolean(categoriesError) || categories.length === 0}
              >
                <option value="" disabled>
                  {categoriesLoading
                    ? "Loading categories…"
                    : categoriesError
                      ? "Categories unavailable"
                      : "Select a category"}
                </option>
                {categories.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {categoriesError && (
                <p className="text-sm text-red-600" role="alert">
                  {categoriesError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                required
                rows={5}
                className={`${inputClass} resize-y`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your request…"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={
                submitting ||
                categoriesLoading ||
                Boolean(categoriesError) ||
                categories.length === 0
              }
              className="mt-1 rounded-lg bg-italy-green px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-italy-green-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit ticket"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
