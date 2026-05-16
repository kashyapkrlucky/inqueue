import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  ListTodoIcon,
  LogOutIcon,
  SquareChartGanttIcon,
  StickyNoteIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../../features/auth/store/useAuthStore";
import { APP_NAME } from "../../constants";
import { Button } from "../form/Button";

export default function Sidebar() {
  const navItems = [
    { to: "/", icon: Home },
    { to: "/tasks", icon: ListTodoIcon },
    { to: "/notes", icon: StickyNoteIcon },
    { to: "/roadmap", icon: SquareChartGanttIcon },
  ];
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const hostUrl = import.meta.env.VITE_API_URL;
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
    <nav className="w-16 md:w-16 p-2 bg-white border-r border-gray-200 flex flex-col gap-6">
      <Link to="/" className="flex items-center">
        <p className="hidden md:block text-lg font-bold m-auto text-indigo-600 text-lg font-bold">
          {APP_NAME}
        </p>
        <span className="block md:hidden m-auto text-indigo-600 text-lg font-bold">
          {APP_NAME}
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

      <div
        className="relative flex flex-col items-center justify-center"
        ref={dropdownRef}
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        aria-haspopup="true"
        aria-expanded={isProfileOpen}
      >
        <img
          className={
            "h-10 w-10 rounded-full cursor-pointer" +
            (isProfileOpen ? " ring-2 ring-indigo-500" : "")
          }
          src={hostUrl + "/avatars/" + user?.avatar || "/user.png"}
          alt="User profile"
        />

        {/* Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute left-10 bottom-10 w-56 bg-white rounded-lg shadow-xl py-1 border border-gray-100 ring-opacity-5 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-700">{user?.name || "Guest"}</p>
              <p className="text-xs text-gray-500">@{user?.username}</p>
            </div>
            <div className="py-1 border-t border-gray-100">
              <Button variant="danger" onClick={handleLogout}>
                <LogOutIcon className="h-5 w-5 mr-3" />
                <span className="text-base">Sign out</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
