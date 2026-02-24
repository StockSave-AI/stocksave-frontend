import { FaShieldAlt } from "react-icons/fa";
import SectionCard from "./SectionCard";
import Input from "./Input";
import ActionButtons from "./ActionButtons";

export default function PinSection() {
  return (
    <SectionCard icon={<FaShieldAlt />} title="PIN Settings">
      <div className="grid md:grid-cols-2 gap-4">
        <Input type="password" placeholder="Current PIN" />
        <Input type="password" placeholder="New PIN" />
      </div>
      <ActionButtons primary="Update PIN" single />
    </SectionCard>
  );
}
