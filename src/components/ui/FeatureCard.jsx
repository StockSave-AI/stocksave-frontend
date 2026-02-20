import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export default function FeatureCard({
  title,
  description,
  icon,
  points,
  iconBg,
  iconBorder,
  pointColor,
}) {
  return (
    <div className="border rounded-xl p-6 flex flex-col gap-4 text-center lg:text-left shadow-sm hover:shadow-md transition">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md"
        style={{
          backgroundColor: iconBg,
        }}
      >
        <div className="text-white text-2xl flex items-center justify-center">
          {icon}
        </div>
      </div>

      <h2 className="text-h3">{title}</h2>

      <p className="text-neutral-600 text-sm">{description}</p>

      <ul className="mt-2 flex flex-col gap-2 text-sm text-neutral-700">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <IoMdCheckmarkCircleOutline
              className="flex-shrink-0"
              style={{ color: pointColor }}
            />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
