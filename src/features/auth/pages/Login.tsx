import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { Button } from "../../../shared/components/form/Button";
import { CircleUserRoundIcon, Loader2Icon, LogInIcon } from "lucide-react";
import {
  TEXT_WELCOME_BACK,
  TEXT_DESCRIPTION,
  TEXT_ATLAS_ID_DESCRIPTION,
  TEXT_SIGN_IN_WITH_ATLAS_ID,
  TEXT_OR,
  TEXT_CONTINUE_AS_GUEST,
  TEXT_COPYRIGHT,
  // TEXT_PRIVACY,
  // TEXT_TERMS,
  // TEXT_BY_CONTINUING,
  // TEXT_AND,
} from "../constants";
// import PageLink from "../../../shared/components/content/PageLink";
import PageLoader from "../../../shared/components/loaders/PageLoader";

export default function Login() {
  const navigate = useNavigate();
  const { onGuestLogin, isAuthenticated, loading, isGuestLoading } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleGuestLogin = async () => {
    const token = await onGuestLogin();
    if (token) {
      navigate("/");
    } else {
      alert("Failed to login as guest. Please try again.");
    }
  };

  const onAtlasLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/login?client_id=${import.meta.env.VITE_CLIENT_ID}`;
  };

  if(loading) {
    return <PageLoader/>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm p-8 rounded-2xl border border-slate-200/50 flex flex-col items-center text-center gap-8 transition-all duration-300 shadow">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="mb-6 inline-flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 rounded-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {TEXT_WELCOME_BACK}
          </h1>
          <p className="text-sm text-slate-600">{TEXT_DESCRIPTION}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <Button disabled={loading} onClick={onAtlasLogin}>
            <span className="flex items-center justify-center gap-2">
              <LogInIcon />
              {TEXT_SIGN_IN_WITH_ATLAS_ID}
            </span>
          </Button>
          <p className="text-xs text-slate-600">{TEXT_ATLAS_ID_DESCRIPTION}</p>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">{TEXT_OR}</span>
            </div>
          </div>

          <Button
            disabled={isGuestLoading}
            variant="outline"
            onClick={handleGuestLogin}
          >
            <span className="flex items-center justify-center gap-2">
              {isGuestLoading ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <CircleUserRoundIcon className="w-4 h-4" />
              )}
              {TEXT_CONTINUE_AS_GUEST}
            </span>
          </Button>
        </div>

        {/* Terms and Conditions */}
        <div className="text-center space-y-1">
          {/* <p className="text-xs text-slate-500 leading-relaxed">
            {TEXT_BY_CONTINUING}&nbsp;
            <PageLink url="/terms" size="xs" text={TEXT_TERMS} /> {TEXT_AND}&nbsp;
            <PageLink url="/privacy" size="xs" text={TEXT_PRIVACY} />
          </p> */}
          <p className="text-xs text-slate-400">&copy; {TEXT_COPYRIGHT}</p>
        </div>
      </div>
    </div>
  );
}
