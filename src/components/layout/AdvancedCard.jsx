import { FiCheck } from "react-icons/fi";

export default function AdvancedCard({
  title,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  bullets,
}) {
  return (
    <article className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div
          className={`shrink-0 h-11 w-11 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon className={`text-xl ${iconColor}`} />
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
          <p className="mt-2 text-sm sm:text-[15px] text-neutral-600 leading-relaxed max-w-xl">
            {description}
          </p>

          <ul className="mt-4 space-y-2">
            {bullets?.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 text-sm text-neutral-700"
              >
                <span className="mt-0.5 text-neutral-500">
                  <FiCheck />
                </span>
                <span className="leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
