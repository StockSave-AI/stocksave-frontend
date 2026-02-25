export default function NotificationItem({ children }) {
  return (
    <div className="group flex items-center justify-between p-5 rounded-card bg-white border border-neutral-100 shadow-sm">
      {children}
    </div>
  );
}
