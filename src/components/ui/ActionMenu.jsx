import { useEffect, useRef, useState } from "react";

export default function ActionMenu({ renderTrigger, children, menuClassName = "" }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block text-left">
      <div onClick={() => setOpen((v) => !v)} className="cursor-pointer">
        {renderTrigger(open)}
      </div>
      {open && (
        <div
          ref={menuRef}
          className={`absolute right-0 top-full mt-2 w-32 rounded-lg bg-white shadow-lg border border-neutral-100 py-1.5 z-50 animate-fade-in ${menuClassName}`}
        >
          {children({ close: () => setOpen(false) })}
        </div>
      )}
    </div>
  );
}
