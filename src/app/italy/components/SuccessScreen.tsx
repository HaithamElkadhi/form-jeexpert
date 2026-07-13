export default function SuccessScreen() {
  return (
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
      <h2 className="text-xl font-semibold text-gray-900">You&apos;re all set</h2>
      <p className="max-w-xs text-gray-600">
        A consultant will reach out to schedule your first meeting.
      </p>
    </div>
  );
}
