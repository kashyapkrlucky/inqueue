import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { APP_NAME } from "../../utils/constants";

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-indigo-600">{APP_NAME}</h1>
          </Link>


          {/* Navigation */}
          <nav className="flex items-center space-x-2">
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
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 border border-gray-100 ring-opacity-5">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">
                      {user?.name || "Homer Simpson"}
                    </p>
                    <p className="text-xs text-gray-500">@{user?.userName || "homersimpson"}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-3 text-gray-500" />
                      Settings
                    </Link>
                  </div>
                  <div className="py-1 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
