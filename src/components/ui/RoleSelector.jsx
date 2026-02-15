export default function RoleSelector({ role, setRole }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        I am a
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setRole("customer")}
          className={`border rounded-button p-4 text-left transition ${
            role === "customer"
              ? "border-primary-500 bg-primary-100"
              : "border-neutral-300"
          }`}
        >
          <p className="font-medium">Customer</p>
          <p className="text-xs text-neutral-500">Save & access stock</p>
        </button>

        <button
          type="button"
          onClick={() => setRole("owner")}
          className={`border rounded-button p-4 text-left transition ${
            role === "owner"
              ? "border-primary-500 bg-primary-100"
              : "border-neutral-300"
          }`}
        >
          <p className="font-medium">Owner/Admin</p>
          <p className="text-xs text-neutral-500">Manage inventory</p>
        </button>
      </div>
    </div>
  );
}
