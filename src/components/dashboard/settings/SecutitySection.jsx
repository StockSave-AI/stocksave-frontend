import { FaLock } from "react-icons/fa";
import SectionCard from "./SectionCard";
import Input from "./Input";
import ActionButtons from "./ActionButtons";

export default function SecuritySection() {
  return (
    <SectionCard icon={<FaLock />} title="Security">
      <div className="space-y-4">
        <Input type="password" placeholder="Current Password" />
        <Input type="password" placeholder="New Password" />
        <Input type="password" placeholder="Confirm New Password" />
      </div>
      <ActionButtons primary="Update Password" single />
    </SectionCard>
  );
}
