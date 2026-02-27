export default function NotificationItem({ children, className = "" }) {
  return (
    <div className={`group flex items-center justify-between p-5 rounded-card bg-white border border-neutral-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
