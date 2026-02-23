import { AtSignIcon, CameraIcon, SaveIcon, UserIcon } from "lucide-react";
import { type FormEventHandler, useState } from "react";
import useAuthStore from "../../store/useAuthStore";

export default function Profile() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");

  const { user } = useAuthStore();
  const onSubmitNoop: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Profile</h2>
          <p className="mt-1 text-xs text-gray-500">
            Update how your profile appears across the app.
          </p>
        </div>
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-50 text-gray-700">
          <CameraIcon className="h-4 w-4" />
        </div>
      </div>

      <form className="mt-5 space-y-4" onSubmit={onSubmitNoop}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <img
              src={avatar || user?.avatar || "./user.png"}
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
              <CameraIcon className="h-4 w-4 text-gray-400" />
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
              <UserIcon className="h-4 w-4 text-gray-400" />
              <input
                value={name || user?.name || ""}
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
              <AtSignIcon className="h-4 w-4 text-gray-400" />
              <input
                value={userName || ""}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="username"
                className="h-full w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
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
            <SaveIcon className="h-4 w-4" />
            Save changes
          </button>
        </div>
      </form>
    </section>
  );
}
