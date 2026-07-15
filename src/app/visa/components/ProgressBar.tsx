export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full rounded-full bg-italy-green transition-[width] duration-500 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
