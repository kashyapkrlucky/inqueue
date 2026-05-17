import { MoreVerticalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MoreMenuProps {
  menuItems: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[];
}

export const MoreMenu = ({ menuItems }: MoreMenuProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
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

      <button className="cursor-pointer" onClick={() => setShowMenu(!showMenu)}>
        <MoreVerticalIcon className="w-5 h-5 text-gray-400" />
        <span className="sr-only">More options</span>
      </button>

      {showMenu && (
        <div className="absolute top-4 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-2 px-2 py-1 text-left hover:bg-gray-50"
              onClick={item.onClick}
            >
              {item.icon}
              <span className="text-xs text-gray-600">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
