import { Loader2, User } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import Account from "../components/settings/Account";
import Password from "../components/settings/Password";
import Profile from "../components/settings/Profile";

export default function Settings() {
  const { user, loading } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Settings
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your profile and account security.
              </p>
            </div>
            <div className="text-sm font-semibold text-gray-600">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user?.name ?? "Your account"}
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <Profile />
          <Password />
          <Account />
        </div>
      </div>
    </div>
  );
}
