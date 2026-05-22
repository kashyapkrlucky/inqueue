import {
  AlertCircleIcon,
  CheckCircle2Icon,
  InfoIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../form/Button";

export default function CustomToast(type: string, message: string) {
  const toastConfig = [
    {
      type: "success",
      icon: <CheckCircle2Icon />,
      color: "bg-green-100 text-green-800 border-green-600",
    },
    {
      type: "error",
      icon: <XCircleIcon />,
      color: "bg-red-100 text-red-800 border-red-600",
    },
    {
      type: "warning",
      icon: <AlertCircleIcon />,
      color: "bg-orange-100 text-orange-800 border-orange-600",
    },
    {
      type: "info",
      icon: <InfoIcon />,
      color: "bg-slate-100 text-slate-700 border-slate-600",
    },
  ];

  const toastColor = toastConfig.find((config) => config.type === type)?.color;
  const toastIcon = toastConfig.find((config) => config.type === type)?.icon;

  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-custom-enter" : "animate-custom-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex border-2 ${toastColor}`}
      >
        <div className="flex-1 flex flex-row gap-4 p-4">
          {toastIcon}
          <p className="text-base">{message}</p>
        </div>
        <div className="flex border-l border-gray-200">
          <Button variant="ghost" onClick={() => toast.dismiss(t.id)}>
            <XIcon />
          </Button>
        </div>
      </div>
    ),
    { duration: 5000 },
  );
}
