import { Loader2Icon } from "lucide-react";
import type { INote } from "../../types/index.types";

interface NotesActivityProps {
  notesByMonth: {
    months: Array<{ key: string; label: string; count: number }>;
    max: number;
  };
  loading: boolean;
  notes: INote[];
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export function NotesActivity({
  notesByMonth,
  loading,
  notes,
}: NotesActivityProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Notes activity</h2>
          <p className="mt-1 text-xs text-gray-500">
            Created per month (last 6)
          </p>
        </div>
        {loading ? (
          <Loader2Icon className="h-4 w-4 animate-spin text-gray-400" />
        ) : null}
      </div>

      <div className="mt-5 flex items-end gap-2">
        {notesByMonth.months.map((m) => (
          <div key={m.key} className="flex-1">
            <div className="h-24 rounded-xl bg-gray-50 p-2">
              <div
                className="w-full rounded-lg bg-indigo-500"
                style={{
                  height: `${clamp((m.count / notesByMonth.max) * 100, 4, 100)}%`,
                }}
                title={`${m.count} notes`}
              />
            </div>
            <div className="mt-2 text-center text-[11px] font-semibold text-gray-600">
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-gray-50 p-3">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
          <span>Total notes</span>
          <span className="text-gray-900">{notes.length}</span>
        </div>
      </div>
    </div>
  );
}
