import toast from "react-hot-toast";

export default function CustomToast(type: string, message: string) {
    const baseClasses = "rounded-md px-4 py-3 text-sm font-medium shadow-lg border backdrop-blur-sm";

    if (type === "success") {
        return toast.success(message, {
            position: "bottom-right",
            duration: 3000,
            className: `${baseClasses} bg-green-100 text-green-800 border-green-200`,
            iconTheme: {
                primary: "#16a34a",
                secondary: "#dcfce7",
            },
        });
    } else if (type === "error") {
        return toast.error(message, {
            position: "bottom-right",
            duration: 3000,
            className: `${baseClasses} bg-red-100 text-red-800 border-red-200`,
            iconTheme: {
                primary: "#dc2626",
                secondary: "#fef2f2",
            },
        });
    } else if (type === "warning") {
        return toast.custom(message, {
            position: "bottom-right",
            duration: 3000,
            className: `${baseClasses} bg-orange-500 text-amber-900 border-orange-200`,
        });
    } else {
        return toast(message, {
            position: "bottom-right",
            duration: 3000,
            className: `${baseClasses} bg-slate-100 text-slate-700 border-slate-200`,
        });
    }
}