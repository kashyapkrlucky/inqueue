import { Button } from "../form/Button";

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm w-screen h-screen flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col max-w-md w-full animate-in zoom-in-95 duration-200">
        <header className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Please Confirm</h2>
        </header>
        <section className="p-6 text-gray-600">
          <p className="text-base leading-relaxed">{text}</p>
        </section>
        <footer className="p-6 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="md" 
            onClick={closeAction}
            className="px-5"
          >
            Cancel
          </Button>
          <Button 
            size="md" 
            onClick={confirmAction}
            className="px-5"
          >
            Confirm
          </Button>
        </footer>
      </div>
    </div>
  );
}
