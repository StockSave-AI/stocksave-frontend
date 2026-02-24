import { FiDownload, FiPlus, FiShoppingCart } from "react-icons/fi";
import ActionCard from "../ActionCard";

const actionCards = [
  {
    title: "Add Savings",
    description: "Make a manual deposit",
    buttonText: "Add Funds",
    icon: <FiPlus />,
    bgColor: "bg-primary-500",
    path: "/dashboard/add-savings",
  },
  {
    title: "Book Food Items",
    description: "Use savings to book food",
    buttonText: "Book Now",
    icon: <FiShoppingCart />,
    bgColor: "bg-secondary-500",
    path: "/dashboard/book-food",
  },
  {
    title: "Redeem Savings",
    description: "Withdraw funds",
    buttonText: "Withdraw Funds",
    icon: <FiDownload />,
    bgColor: "bg-success",
    path: "/dashboard/redeem",
  },
];

export default function DashboardActionsGrid({ onNavigate }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actionCards.map((card, index) => (
        <ActionCard
          key={index}
          title={card.title}
          description={card.description}
          buttonText={card.buttonText}
          icon={card.icon}
          bgColor={card.bgColor}
          onClick={() => onNavigate(card.path)}
        />
      ))}
    </div>
  );
}
