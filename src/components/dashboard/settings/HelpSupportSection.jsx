import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SectionCard from "./SectionCard";

export default function HelpSupportSection() {
  const navigate = useNavigate();
  const supportItems = [
    { label: "Help Center", path: "/about" },
    { label: "Contact Support", path: "/contact" },
  ];

  return (
    <SectionCard icon={<FaQuestionCircle />} title="Help & Support">
      <div className="grid md:grid-cols-3 gap-4">
        {supportItems.map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            className="border p-6 rounded-xl text-center hover:shadow-md cursor-pointer"
          >
            <p className="font-medium">{item.label}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
