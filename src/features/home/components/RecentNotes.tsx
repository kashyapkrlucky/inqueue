import { ArrowUpRightIcon, ClockIcon, NotebookTextIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { INoteCreate } from "../../notes/types";
import { asDate, formatDate } from "../../../shared/utils";
import InfoCard from "../../../shared/components/content/InfoCard";
import { NoItems } from "../../../shared/components/content/NoItems";

interface RecentNotesProps {
  notes: INoteCreate[];
}

export function RecentNotes({ notes }: RecentNotesProps) {
  return (
    <div className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
      <InfoCard
        title="Recent notes"
        description="Latest updated"
        icon={<NotebookTextIcon className="h-4 w-4" />}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-700"
      />

      <div className="mt-4 space-y-2 h-[240px] overflow-y-auto hide-scrollbar">
        {notes.length === 0 ? (
          <NoItems title="No notes yet." />
        ) : (
          notes.map((n) => {
            const updated = asDate(n.updatedAt) ?? asDate(n.createdAt);
            const snippet = (n.content ?? "").trim().slice(0, 80);
            return (
              <div
                key={n._id}
                className="group flex items-start justify-between gap-2.5 rounded-lg border border-gray-100 bg-white p-2.5 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                    <ClockIcon className="h-3 w-3" />
                    {updated ? `Updated ${formatDate(updated)}` : "—"}
                  </div>
                  <div className="truncate text-xs font-medium text-gray-900">
                    {n.title}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {snippet ? snippet : "No content"}
                  </div>
                </div>
                <Link to="/notes" className="flex-shrink-0 text-indigo-600">
                  <ArrowUpRightIcon className="h-4 w-4" />
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
