export default function StepNav({
  onBack,
  submitLabel = "Continuer",
}: {
  onBack?: () => void;
  submitLabel?: string;
}) {
  return (
    <div className="mt-2 flex items-center gap-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          Retour
        </button>
      )}
      <button
        type="submit"
        className="rounded-lg bg-italy-green px-6 py-3 font-medium text-white transition-colors hover:bg-italy-green-dark"
      >
        {submitLabel}
      </button>
    </div>
  );
}
