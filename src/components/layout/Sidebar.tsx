// src/components/layout/Sidebar.tsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDownIcon,
  Home,
  ListTodo,
  LogOutIcon,
  SettingsIcon,
  StickyNote,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../store/useAuthStore";

export default function Sidebar() {
  const navItems = [
    { to: "/", icon: Home },
    { to: "/tasks", icon: ListTodo },
    { to: "/notes", icon: StickyNote },
  ];
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="w-16 md:w-24 p-2 bg-white border-r border-gray-200 flex flex-col gap-6">
      <Link to="/" className="flex items-center">
        <p className="hidden md:block text-lg font-bold m-auto text-indigo-600 text-lg font-bold">
          Inqueue
        </p>
        <span className="block md:hidden m-auto text-indigo-600 text-lg font-bold">
          InQ
        </span>
      </Link>
      <div className="flex-1 flex flex-col gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center p-2 text-sm font-medium rounded-md ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <item.icon className="m-auto h-5 w-5" />
          </NavLink>
        ))}
      </div>

      <div className="relative ml-2" ref={dropdownRef}>
        <button
          className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          aria-haspopup="true"
          aria-expanded={isProfileOpen}
        >
          <img
            className="h-8 w-8 rounded-full"
            src={user?.avatar || "/user.png"}
            alt="User profile"
          />
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </button>

        {/* Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute left-0 bottom-10 w-56 bg-white rounded-md shadow-lg py-1 border border-gray-100 ring-opacity-5">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-700">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500">
                @{user?.userName}
              </p>
            </div>
            <div className="py-1">
              <Link
                to="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <SettingsIcon className="h-4 w-4 mr-3 text-gray-500" />
                Settings
              </Link>
            </div>
            <div className="py-1 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <LogOutIcon className="h-4 w-4 mr-3" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
