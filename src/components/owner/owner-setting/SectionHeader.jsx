import { createElement } from "react";

const SectionHeader = ({ icon, title, colorClass }) => {
  const iconNode = icon
    ? createElement(icon, {
        className: `${colorClass.replace("bg-", "text-")}`,
        size: 20,
      })
    : null;

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
        {iconNode}
      </div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
        {title}
      </h2>
    </div>
  );
};

export default SectionHeader;
