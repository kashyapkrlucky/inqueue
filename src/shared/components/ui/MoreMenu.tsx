import { MoreVerticalIcon } from "lucide-react";
import { useEffect, useRef } from "react";

interface MoreMenuProps {
  moreMenuOpen: boolean;
  setMoreMenuOpen: (value: boolean) => void;
  menuItems: {
    value?: React.ReactNode;
  }[];
}

export const MoreMenu = ({ moreMenuOpen, setMoreMenuOpen, menuItems }: MoreMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative" ref={menuRef}>
      {/* more menu with edit & delete options */}

      <button className="cursor-pointer" onClick={() => setMoreMenuOpen(!moreMenuOpen)}>
        <MoreVerticalIcon className="w-5 h-5 text-gray-400" />
        <span className="sr-only">More options</span>
      </button>

      {moreMenuOpen && (
        <div className="absolute top-4 right-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          {menuItems.map((item, index) => (
            <div key={index}>{item.value}</div>
          ))}
        </div>
      )}
    </div>
  );
};
