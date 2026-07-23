export default function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-start gap-6 text-left">
      <p className="text-sm font-medium text-italy-green">JEExpert</p>
      <h1 className="text-2xl font-semibold leading-snug text-gray-900">
        Checklist bourse régionale — Italie
      </h1>
      <p className="text-gray-600">
        Ce formulaire recueille uniquement les informations nécessaires pour
        déterminer les documents à préparer en Tunisie. La liste générée est
        personnalisée selon votre situation familiale, professionnelle,
        immobilière et bancaire.
      </p>
      <p className="text-sm text-gray-500">
        La checklist est une proposition à vérifier par JEExpert. Les exigences
        peuvent varier selon le bando régional italien.
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
