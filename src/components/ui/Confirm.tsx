import { Button } from "./Button";

interface ConfirmProps {
  text: string;
  confirmAction: () => void;
  closeAction: () => void;
}

export default function Confirm({
  text,
  confirmAction,
  closeAction,
}: ConfirmProps) {
  return (
    <div className="fixed inset-0 bg-gray-900/30 w-screen h-screen flex flex-row items-center justify-center z-50">
      <div className="bg-white rounded-lg flex flex-col shadow-sm">
        <header className="p-4">
          <h1 className="text-lg font-semibold">Confirm</h1>
        </header>
        <section className="px-4 py-6 border-y border-gray-200">
          <h1>{text}</h1>
        </section>
        <footer className="p-4 flex flex-row items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={closeAction}>
            Cancel
          </Button>
          <Button size="sm" onClick={confirmAction}>
            Confirm
          </Button>
        </footer>
      </div>
    </div>
  );
}
