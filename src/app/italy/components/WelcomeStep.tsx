export default function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-start gap-6 text-left">
      <h1 className="text-2xl font-semibold leading-snug text-gray-900">
        Your path to studying in Italy
      </h1>
      <p className="text-gray-600">
        Tell us about yourself and your academic background, and a JEExpert
        consultant will reach out to help plan your studies in Italy.
      </p>
      <button
        type="button"
        onClick={onNext}
        className="rounded-lg bg-italy-green px-6 py-3 font-medium text-white transition-colors hover:bg-italy-green-dark"
      >
        Get started
      </button>
    </div>
  );
}
