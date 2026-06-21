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
    <>
      <section className="text-gray-600 mb-4">
        <p className="text-base leading-relaxed">{text}</p>
      </section>
      <footer className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
        <Button
          variant="outline"
          size="md"
          onClick={closeAction}
          className="px-5"
        >
          Cancel
        </Button>
        <Button size="md" onClick={confirmAction} className="px-5">
          Confirm
        </Button>
      </footer>
    </>
  );
}
