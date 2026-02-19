import { useMemo, useState, type FormEventHandler } from "react";
import {
  AtSign,
  Camera,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  Save,
  ShieldAlert,
  Trash2,
  User,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import type { IUser } from "../types/index.types";

function SettingsForm({
  initial,
  user,
  loading,
}: {
  initial: { name: string; email: string; userName: string; avatar: string };
  user: IUser | null;
  loading: boolean;
}) {
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [userName, setUserName] = useState(initial.userName);
  const [avatar, setAvatar] = useState(initial.avatar);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState("");

  const onSubmitNoop: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  const canDelete = deleteConfirm.trim().toUpperCase() === "DELETE";

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

        <div className="grid grid-cols-1"> 
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Profile</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Update how your profile appears across the app.
                  </p>
                </div>
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-50 text-gray-700">
                  <Camera className="h-4 w-4" />
                </div>
              </div>

              <form className="mt-5 space-y-4" onSubmit={onSubmitNoop}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatar || user?.avatar || "/user.png"}
                      alt="Profile"
                      className="h-14 w-14 rounded-2xl border border-gray-200 object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Avatar</p>
                      <p className="text-xs text-gray-500">UI only</p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Avatar URL
                    </label>
                    <div className="mt-1 flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
                      <Camera className="h-4 w-4 text-gray-400" />
                      <input
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://…"
                        className="h-full w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Name
                    </label>
                    <div className="mt-1 flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
                      <User className="h-4 w-4 text-gray-400" />
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="h-full w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Username
                    </label>
                    <div className="mt-1 flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
                      <AtSign className="h-4 w-4 text-gray-400" />
                      <input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="username"
                        className="h-full w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </label>
                  <div className="mt-1 flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-full w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-500">
                    This is UI-only right now; saving does not persist.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                  >
                    <Save className="h-4 w-4" />
                    Save changes
                  </button>
                </div>
              </form>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Password</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Change your password to keep your account secure.
                  </p>
                </div>
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                  <KeyRound className="h-4 w-4" />
                </div>
              </div>

              <form className="mt-5 space-y-4" onSubmit={onSubmitNoop}>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Current password
                  </label>
                  <div className="mt-1 flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
                    <KeyRound className="h-4 w-4 text-gray-400" />
                    <input
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      type={showCurrent ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-full w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent((v) => !v)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                      aria-label={showCurrent ? "Hide current password" : "Show current password"}
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      New password
                    </label>
                    <div className="mt-1 flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
                      <KeyRound className="h-4 w-4 text-gray-400" />
                      <input
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type={showNew ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-full w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((v) => !v)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                        aria-label={showNew ? "Hide new password" : "Show new password"}
                      >
                        {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Confirm password
                    </label>
                    <div className="mt-1 flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
                      <KeyRound className="h-4 w-4 text-gray-400" />
                      <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-full w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                        aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-500">
                    UI-only. No password changes are sent to the server.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                  >
                    <KeyRound className="h-4 w-4" />
                    Update password
                  </button>
                </div>
              </form>
            </section> 
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Account</h2>
                  <p className="mt-1 text-xs text-gray-500">Your current identity</p>
                </div>
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                  <User className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    {user?.name ?? "—"}
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Username
                  </div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    {user?.userName ? `@${user.userName}` : "—"}
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    {user?.email ?? "—"}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-red-900">Danger zone</h2>
                  <p className="mt-1 text-xs text-red-700">
                    Delete your account and all related data.
                  </p>
                </div>
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                  <ShieldAlert className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-900">Delete account</p>
                <p className="mt-1 text-xs text-red-800">
                  This is UI-only. No deletion request will be made.
                </p>

                <div className="mt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-red-800">
                    Type DELETE to confirm
                  </label>
                  <input
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="DELETE"
                    className="mt-1 h-11 w-full rounded-xl border border-red-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/10"
                  />
                </div>

                <button
                  type="button"
                  disabled={!canDelete}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete account
                </button>
              </div>
            </section>
          
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { user, loading } = useAuthStore();

  const initial = useMemo(() => {
    return {
      name: user?.name ?? "",
      email: user?.email ?? "",
      userName: user?.userName ?? "",
      avatar: user?.avatar ?? "",
    };
  }, [user?.avatar, user?.email, user?.name, user?.userName]);

  return (
    <SettingsForm
      key={user?._id ?? "anonymous"}
      initial={initial}
      user={user}
      loading={loading}
    />
  );
}