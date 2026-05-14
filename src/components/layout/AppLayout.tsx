// src/components/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { getCodeFromURL } from "../../utils/helpers";
import useAuthStore from "../../store/useAuthStore";

export default function AppLayout() {
  const navigate = useNavigate();
  const [isOAuthChecked, setIsOAuthChecked] = useState(false);
  const { getUserData, isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = getCodeFromURL();
      if (code) {
        try {
          await getUserData(code);
          setIsOAuthChecked(true);
        } catch (error) {
          console.error("OAuth callback failed:", error);
        }
      } else {
        setIsOAuthChecked(true);
      }
    };

    handleOAuthCallback();
  }, [getUserData]);

  useEffect(() => {
    if (isOAuthChecked && !isAuthenticated && !loading) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, isOAuthChecked, navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-row h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
