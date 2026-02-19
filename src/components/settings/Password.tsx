import { EyeIcon, EyeOffIcon, KeyRoundIcon } from "lucide-react";
import { type FormEventHandler, useState } from "react";

export default function Password() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const onSubmitNoop: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Password</h2>
          <p className="mt-1 text-xs text-gray-500">
            Change your password to keep your account secure.
          </p>
        </div>
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
          <KeyRoundIcon className="h-4 w-4" />
        </div>
      </div>

      <form className="mt-5 space-y-4" onSubmit={onSubmitNoop}>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Current password
          </label>
          <div className="mt-1 flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
            <KeyRoundIcon className="h-4 w-4 text-gray-400" />
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
              aria-label={
                showCurrent ? "Hide current password" : "Show current password"
              }
            >
              {showCurrent ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              New password
            </label>
            <div className="mt-1 flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
              <KeyRoundIcon className="h-4 w-4 text-gray-400" />
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
                {showNew ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Confirm password
            </label>
            <div className="mt-1 flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
              <KeyRoundIcon className="h-4 w-4 text-gray-400" />
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
                aria-label={
                  showConfirm
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirm ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
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
            <KeyRoundIcon className="h-4 w-4" />
            Update password
          </button>
        </div>
      </form>
    </section>
  );
}
