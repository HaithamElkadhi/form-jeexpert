"use client";

const STEPS = [
  { n: 1, label: "Personal" },
  { n: 2, label: "Academic" },
  { n: 3, label: "Documents" },
] as const;

export default function StepBar({ current }: { current: 1 | 2 | 3 }) {
  return (
    <nav aria-label="Form steps" className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <div key={s.n} className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  done
                    ? "bg-italy-green text-white"
                    : active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path
                      d="M2.5 7.5L5.5 10.5L11.5 3.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  s.n
                )}
              </div>
              <span
                className={`text-xs ${
                  active ? "font-medium text-blue-700" : done ? "text-italy-green" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mb-5 h-0.5 flex-1 ${done ? "bg-italy-green" : "bg-gray-200"}`}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
