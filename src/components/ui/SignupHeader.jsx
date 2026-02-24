import LogoCenterImg from "../layout/LogoCenterImg";

export default function SignupHeader({ text }) {
  return (
    <div className="bg-gradient-to-r from-primary-200 to-primary-100 py-10 text-center px-6">
      <LogoCenterImg />
      <h2 className="text-h2 mt-4">Stock Save AI</h2>
      <p className="text-sm text-neutral-600 mt-1">{text}</p>
    </div>
  );
}
