import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BotMessageSquareIcon,
  CalendarRangeIcon,
  KanbanIcon,
  LayoutDashboardIcon,
  ListTodoIcon,
  LogOutIcon,
  StickyNoteIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../../features/auth/store/useAuthStore";
import { APP_NAME } from "../../constants";
import { Button } from "../form/Button";

const navItems = [
  { to: "/", icon: LayoutDashboardIcon, label: "Home" },
  { to: "/board", icon: KanbanIcon, label: "Board" },
  { to: "/tasks", icon: ListTodoIcon, label: "Tasks" },
  { to: "/calendar", icon: CalendarRangeIcon, label: "Calendar" },
  { to: "/notes", icon: StickyNoteIcon, label: "Notes" },
];

export default function Sidebar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const hostUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getAvatarUrl = () => {
    if (user?.avatar) {
      return `${hostUrl}/avatars/${user.avatar}`;
    }
    return "/user.png";
  };

  return (
    <nav className="w-16 md:w-20 bg-white border-r border-gray-200/50 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-4 border-b border-gray-100">
        <Link to="/" className="flex items-center justify-center">
          <span className="text-xl font-bold text-indigo-600 tracking-tight">
            {APP_NAME}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col py-4 px-2 gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group relative flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
            <span className="absolute left-0 w-1 h-8 rounded-r-full bg-indigo-500 opacity-0 group-[.active]:opacity-100 transition-all duration-200" />
          </NavLink>
        ))}

        <NavLink
          to="/ask-tia"
          className={({ isActive }) =>
            `group relative flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-indigo-500 text-white shadow-sm"
                : "bg-indigo-300 text-white"
            }`
          }
          title="Agent"
        >
          <BotMessageSquareIcon className="w-5 h-5" />
          <span className="absolute left-0 w-1 h-8 rounded-r-full bg-indigo-500 opacity-0 group-[.active]:opacity-100 transition-all duration-200" />
        </NavLink>
      </div>

      {/* Profile */}
      <div className="p-3 border-t border-gray-100">
        <div
          className="relative"
          ref={dropdownRef}
        >
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
          >
            <img
              src={getAvatarUrl()}
              alt={user?.name || "User profile"}
              className={`w-10 h-10 rounded-full object-cover ring-2 ring-transparent transition-all duration-200 ${
                isProfileOpen ? "ring-indigo-500 shadow-md" : "group-hover:ring-gray-200"
              }`}
              onError={(e) => {
                e.currentTarget.src = "/user.png";
              }}
            />
          </button>

          {/* Dropdown */}
          {isProfileOpen && (
            <div className="absolute left-full ml-2 bottom-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden z-50 animate-in slide-in-from-left-2 fade-in duration-200">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatarUrl()}
                    alt={user?.name || "User profile"}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100"
                    onError={(e) => {
                      e.currentTarget.src = "/user.png";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.name || "Guest"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">@{user?.username || "guest"}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  className="w-full justify-start"
                >
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Sign out</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
