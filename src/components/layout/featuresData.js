import {
  FiCreditCard,
  FiShoppingBag,
  FiPackage,
  FiBell,
  FiSmartphone,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";

export const featuresData = [
  {
    title: "Flexible Savings Plans",
    description:
      "Create custom savings plans with flexible payment schedules. Save daily, weekly, or monthly at your own pace with automated reminders and tracking.",
    icon: FiTrendingUp,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    bullets: [
      "Daily, weekly, monthly options",
      "Automated payment tracking",
      "Goal-based savings",
      "Progress visualization",
    ],
    bulletColor: "text-emerald-600",
  },
  {
    title: "Paystack Integration",
    description:
      "Secure payment processing through Paystack. Make deposits easily via bank transfer, card payments, or USSD codes.",
    icon: FiCreditCard,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    bullets: [
      "Bank transfer payments",
      "Debit/credit card support",
      "USSD quick deposits",
      "Instant confirmation",
    ],
    bulletColor: "text-indigo-600",
  },
  {
    title: "Food Booking System",
    description:
      "Book food items in Nigerian market units (full bags, paint, derica). Buy exactly what you need without purchasing full bags.",
    icon: FiShoppingBag,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    bullets: [
      "Nigerian market units (mudu, paint)",
      "Flexible quantity selection",
      "Real-time price calculation",
      "Easy checkout process",
    ],
    bulletColor: "text-orange-600",
  },
  {
    title: "Shared Stock Inventory",
    description:
      "View real-time inventory of available food items. See prices, quantities, and book items from a shared community pool.",
    icon: FiPackage,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    bullets: [
      "Real-time stock updates",
      "Live price information",
      "Quantity availability",
      "Multiple item categories",
    ],
    bulletColor: "text-purple-600",
  },
  {
    title: "Smart Notifications",
    description:
      "Stay updated with payment reminders, stock alerts, and important announcements. Filter and manage all notifications in one place.",
    icon: FiBell,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
    bullets: [
      "Payment reminders",
      "Stock availability alerts",
      "Booking confirmations",
      "Custom notification filters",
    ],
    bulletColor: "text-pink-600",
  },
  {
    title: "Mobile Optimized",
    description:
      "Access your account anywhere, anytime. Our platform is fully optimized for mobile devices, making it easy to manage savings on the go.",
    icon: FiSmartphone,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    bullets: [
      "Responsive design",
      "Touch-friendly interface",
      "Fast loading times",
      "Offline capability",
    ],
    bulletColor: "text-blue-600",
  },
  {
    title: "OTP Verification",
    description:
      "Secure your account with OTP (One-Time Password) verification for sensitive actions like withdrawals and account changes.",
    icon: FiShield,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    bullets: [
      "SMS OTP verification",
      "Secure withdrawals",
      "Account protection",
      "Two-factor authentication",
    ],
    bulletColor: "text-red-600",
  },
  {
    title: "Easy Redemption",
    description:
      "Redeem your savings when you reach your goals. Withdraw to your bank account or use savings to purchase food items directly.",
    icon: FiTrendingUp,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    bullets: [
      "Bank withdrawal option",
      "Direct food purchase",
      "Partial redemptions",
      "Quick processing",
    ],
    bulletColor: "text-green-600",
  },
];
