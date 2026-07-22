import { Outlet } from "react-router-dom";
import Sidebar from "../shared/components/layout/Sidebar";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { getCodeFromURL } from "../shared/utils";
import PageLoader from "../shared/components/loaders/PageLoader";
import useAuthStore from "../features/auth/store/useAuthStore";

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
        } catch (error) {
          console.error("OAuth callback failed:", error);
        } finally {
          setIsOAuthChecked(true);
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

  // Outlet (and the ProtectedRoute it renders) must not mount until we know
  // whether there's an OAuth code to exchange — otherwise ProtectedRoute's
  // own effect (which fires before this one) sees isAuthenticated=false and
  // redirects to /login before the code is ever read from the URL.
  if (!isOAuthChecked) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <div className="flex flex-row h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
    </Suspense>
  );
}
