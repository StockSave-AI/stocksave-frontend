import { FaQuestionCircle } from "react-icons/fa";
import SectionCard from "./SectionCard";

export default function HelpSupportSection() {
  return (
    <SectionCard icon={<FaQuestionCircle />} title="Help & Support">
      <div className="grid md:grid-cols-3 gap-4">
        {["Help Center", "Contact Support", "Privacy Policy"].map((item) => (
          <div
            key={item}
            className="border p-6 rounded-xl text-center hover:shadow-md cursor-pointer"
          >
            <p className="font-medium">{item}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
