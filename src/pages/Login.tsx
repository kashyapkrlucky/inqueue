import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useAuth } from "../hooks/useAuth";
import { APP_NAME } from "../utils/constants";
import { Button } from "../components/ui/Button";
import { CircleUserRoundIcon, LogInIcon } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { onGuestLogin } = useAuthStore();

  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleGuestLogin = async () => {
    const token = await onGuestLogin();
    if (token) {
      navigate("/");
    } else {
      alert("Failed to login as guest. Please try again.");
    }
  };

  const onAtlasLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm p-8 rounded-2xl border border-slate-200/50 flex flex-col items-center text-center gap-8 transition-all duration-300 shadow">

        {/* Logo Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl shadow-sm border border-black/20">
            <span className="text-4xl font-bold text-gray-900">INQ</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-600">
            InQueue is your professional task and notes manager, helping you
            stay organized and productive.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <Button disabled={loading} onClick={onAtlasLogin}>
            <span className="flex items-center justify-center gap-2">
              <LogInIcon />
              Sign in with Atlas ID
            </span>
          </Button>
          <p className="text-xs text-slate-600">
            Atlas ID is your unified identity across all Atlas services
          </p>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">or</span>
            </div>
          </div>

          <Button
            disabled={loading}
            variant="outline"
            onClick={handleGuestLogin}
          >
            <span className="flex items-center justify-center gap-2">
              <CircleUserRoundIcon />
              Continue as Guest
            </span>
          </Button>
        </div>

        {/* Terms and Conditions */}
        <div className="text-center space-y-1">
          <p className="text-xs text-slate-500 leading-relaxed">
            By continuing, you agree to our{" "}
            <a
              href="/terms"
              className="text-blue-600 hover:text-blue-700 underline transition-colors duration-200 font-medium"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-blue-600 hover:text-blue-700 underline transition-colors duration-200 font-medium"
            >
              Privacy Policy
            </a>
          </p>
          <p className="text-xs text-slate-400">
            &copy; 2026 {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
