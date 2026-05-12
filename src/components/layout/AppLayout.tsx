// src/components/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { getCodeFromURL } from "../../utils/helpers";
import useAuthStore from "../../store/useAuthStore";

export default function AppLayout() {
  const { isAuthenticated, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const { getUserData } = useAuthStore();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = getCodeFromURL();
      console.log(code);

      if (code) {
        setIsOAuthLoading(true);
        try {
          const result = await getUserData(code);
          if (result?.token) {
            login(result.user, result.token);
          }
        } catch (error) {
          console.error("OAuth callback failed:", error);
        } finally {
          setIsOAuthLoading(false);
        }
      }
    };

    handleOAuthCallback();
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated && !isOAuthLoading) {
      // navigate("/login");
    }
  }, [isAuthenticated, authLoading, isOAuthLoading, navigate]);

  if (authLoading) {
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
