import AdvancedCard from "./AdvancedCard";
import { advancedData } from "./advancedData";

export default function AdvancedGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {advancedData.map((item) => (
        <AdvancedCard key={item.title} {...item} />
      ))}
    </div>
  );
}
