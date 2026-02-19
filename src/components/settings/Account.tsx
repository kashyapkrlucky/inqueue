import { ShieldAlertIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

export default function Account() {
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const canDelete = deleteConfirm === "DELETE";

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-red-900">Danger zone</h2>
          <p className="mt-1 text-xs text-red-700">
            Delete your account and all related data.
          </p>
        </div>
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-red-50 text-red-700">
          <ShieldAlertIcon className="h-4 w-4" />
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
          <Trash2Icon className="h-4 w-4" />
          Delete account
        </button>
      </div>
    </section>
  );
}
