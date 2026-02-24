export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    />
  );
}
