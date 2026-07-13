import Link from "next/link";
import { FORMS } from "@/lib/forms";
import CopyLinkButton from "./CopyLinkButton";

export default function FormsPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-16">
      <h1 className="text-2xl font-semibold">Forms</h1>
      <p className="mt-1 text-sm text-gray-500">
        All intake forms JEExpert currently uses.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {FORMS.map((form) => (
          <div
            key={form.slug}
            className="relative flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
          >
            <Link
              href={`/${form.slug}`}
              className="absolute inset-0 rounded-xl"
              aria-label={form.name}
            />
            <span className="relative pointer-events-none font-medium">
              {form.name}
            </span>
            <div className="relative">
              <CopyLinkButton slug={form.slug} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
