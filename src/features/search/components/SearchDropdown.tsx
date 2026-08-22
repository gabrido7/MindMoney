import { useEffect, useRef, useState } from "react";
import Icon from "../../../components/ui/Icon";
import SmartSearch from "./SmartSearch";

export default function SearchDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Buscar"
        aria-expanded={open}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <Icon name="search" size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[26rem] max-w-[90vw] max-h-[32rem] overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 z-50 p-4">
          <SmartSearch autoFocus onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
