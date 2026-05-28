import { Outlet } from "react-router-dom";
import Sidebar from "../shared/components/layout/Sidebar";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { getCodeFromURL } from "../shared/utils";
import PageLoader from "../shared/components/loaders/PageLoader";
import useAuthStore from "../features/auth/store/useAuthStore";
// import ChatBot from "../shared/components/layout/ChatBot";

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
  
  if (loading && !isOAuthChecked) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <div className="flex flex-row h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        {/* <ChatBot /> */}
        <Toaster position="bottom-left" reverseOrder={false} />
      </div>
    </Suspense>
  );
}
