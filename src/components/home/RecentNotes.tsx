import { ArrowUpRightIcon, ClockIcon, NotebookTextIcon } from "lucide-react";
import type { INote } from "../../types/index.types";
import { asDate, formatDate } from "../../utils/helpers";

interface RecentNotesProps {
  notes: INote[];
}

export function RecentNotes({ notes }: RecentNotesProps) {
  return (
    <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Recent notes</h2>
          <p className="mt-1 text-xs text-gray-500">Latest updated</p>
        </div>
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
          <NotebookTextIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {notes.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
            No notes yet.
          </div>
        ) : (
          notes.map((n) => {
            const updated = asDate(n.updatedAt) ?? asDate(n.createdAt);
            const snippet = (n.content ?? "").trim().slice(0, 80);
            return (
              <div
                key={n._id}
                className="rounded-xl border border-gray-200 p-3 transition hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-gray-900">
                      {n.title}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {snippet ? snippet : "No content"}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <ClockIcon className="h-3.5 w-3.5" />
                      {updated ? `Updated ${formatDate(updated)}` : "—"}
                    </div>
                  </div>
                  <ArrowUpRightIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
