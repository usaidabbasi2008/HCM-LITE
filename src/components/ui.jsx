export function Button({ variant = "primary", className = "", ...p }) {
  const styles = {
    primary: "bg-teal-600 text-white hover:bg-teal-700",
    ghost: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${styles[variant]} ${className}`}
      {...p}
    />
  );
}

export function Input({ label, className = "", ...p }) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1 block font-medium text-slate-600">{label}</span>}
      <input
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 ${className}`}
        {...p}
      />
    </label>
  );
}

export const Card = ({ className = "", ...p }) => (
  <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`} {...p} />
);

export const ErrorText = ({ children }) =>
  children ? (
    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{children}</p>
  ) : null;

export const Spinner = () => (
  <div className="flex h-40 items-center justify-center text-sm text-slate-500">Loading…</div>
);