export default function ToggleSwitch() {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" />
      <div className="w-11 h-6 bg-neutral-200 rounded-full peer-checked:bg-primary-500 peer-focus:ring-2 peer-focus:ring-primary-300 transition-all"></div>
      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-full transition-transform"></div>
    </label>
  );
}
