export default function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-start gap-6 text-left">
      <h1 className="text-2xl font-semibold leading-snug text-gray-900">
        Profil étudiant — Italie
      </h1>
      <p className="text-gray-600">
        Parlez-nous de vous et de votre parcours académique. Un consultant
        JEExpert vous recontactera pour vous accompagner dans votre projet
        d&apos;études en Italie.
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
