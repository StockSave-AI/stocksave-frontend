export default function NotificationFilter({ children, className = "" }) {
  return (
    <div className={`bg-white border border-neutral-100 rounded-card p-5 text-sm ${className}`}>
      {children}
    </div>
  );
}
