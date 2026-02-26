import { FiCheck } from "react-icons/fi";

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  bullets,
  bulletColor,
}) {
  return (
    <article className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div
          className={`shrink-0 h-11 w-11 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon className={`text-xl ${iconColor}`} />
        </div>

        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-neutral-900">
            {title}
          </h3>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
            {description}
          </p>

          <ul className="mt-4 space-y-2">
            {bullets?.map((text) => (
              <li
                key={text}
                className="flex items-start gap-2 text-sm text-neutral-700"
              >
                <span className={`mt-0.5 ${bulletColor}`}>
                  <FiCheck />
                </span>
                <span className="leading-snug">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
