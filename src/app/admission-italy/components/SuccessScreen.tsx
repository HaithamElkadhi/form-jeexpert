export default function SuccessScreen() {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-italy-green/15 text-italy-green">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path
            d="M7 17L13 23L25 9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900">Dossier received</h2>
      <p className="max-w-sm text-gray-600">
        Thanks — your admission documents have been recorded. A JEExpert consultant will review
        your file and follow up shortly.
      </p>
    </div>
  );
}
