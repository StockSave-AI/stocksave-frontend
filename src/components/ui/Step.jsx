export default function Step({ number, title, brief }) {
  const colors = {
    "01": "bg-primary-600",
    "02": "bg-primary-300",
    "03": "bg-secondary-500",
    "04": "bg-primary-500",
    "05": "bg-secondary-400",
  };

  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div
        className={`${colors[number]} w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white 
                    shadow-[0_5px_15px_rgba(0,0,0,0.2)] transform transition-transform duration-300 hover:scale-105`}
      >
        {number}
      </div>
      <p className="text-md font-semibold mt-2">{title}</p>
      <p className="text-sm text-neutral-600">{brief}</p>
    </div>
  );
}
