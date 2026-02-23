export default function ActionButtons({
  primary,
  single,
  onPrimary,
  onSecondary,
  primaryDisabled,
  secondaryDisabled,
}) {
  return (
    <div className={`flex ${single ? "justify-end" : "justify-end gap-4"}`}>
      {!single && (
        <button
          type="button"
          onClick={onSecondary}
          disabled={secondaryDisabled}
          className="border px-4 py-2 rounded-lg hover:bg-neutral-100 disabled:opacity-50"
        >
          Cancel
        </button>
      )}
      <button
        type="button"
        onClick={onPrimary}
        disabled={primaryDisabled}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {primary}
      </button>
    </div>
  );
}
