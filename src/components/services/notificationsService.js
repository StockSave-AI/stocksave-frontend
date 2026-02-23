export async function getNotifications() {
  return [
    {
      id: 1,
      type: "payment",
      title: "Payment Due Soon",
      message: "Your monthly payment of ₦5000 is due on February 15, 2026",
      time: "2 hours ago",
      actions: [{ label: "Make Payment" }, { label: "Mark as Read" }],
    },
  ];
}
