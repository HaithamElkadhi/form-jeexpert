export default function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-start gap-6 text-left">
      <h1 className="text-2xl font-semibold leading-snug text-gray-900">
        Visa études Italie — vérification de dossier
      </h1>
      <p className="text-gray-600">
        Répondez à ces questions sur votre admission, votre parcours et votre
        financement. Nous générons un résumé structuré à transmettre à votre
        consultant pour préparer la checklist visa.
      </p>
      <button
        type="button"
        onClick={onNext}
        className="rounded-lg bg-italy-green px-6 py-3 font-medium text-white transition-colors hover:bg-italy-green-dark"
      >
        Commencer
      </button>
    </div>
  );
}
