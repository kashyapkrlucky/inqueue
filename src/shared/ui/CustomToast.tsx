import toast from "react-hot-toast";

export default function CustomToast(type: string, message: string) {
    const baseStyle = {
        borderRadius: "6px",
        padding: "12px 16px",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        border: "1px solid",
        backdropFilter: "blur(8px)",
    };

    if (type === "success") {
        return toast.success(message, {
            position: "bottom-right",
            duration: 3000,
            style: {
                ...baseStyle,
                backgroundColor: "#dcfce7",
                color: "#166534",
                borderColor: "#bbf7d0",
            },
            iconTheme: {
                primary: "#16a34a",
                secondary: "#dcfce7",
            },
        });
    } else if (type === "error") {
        return toast.error(message, {
            position: "bottom-right",
            duration: 3000,
            style: {
                ...baseStyle,
                backgroundColor: "#fef2f2",
                color: "#991b1b",
                borderColor: "#fecaca",
            },
            iconTheme: {
                primary: "#dc2626",
                secondary: "#fef2f2",
            },
        });
    } else if (type === "warning") {
        return toast.custom(message, {
            position: "bottom-right",
            duration: 3000,
            style: {
                ...baseStyle,
                backgroundColor: "#e97a19",
                color: "#92400e",
                borderColor: "#fed7aa",
            },
        });
    } else {
        return toast(message, {
            position: "bottom-right",
            duration: 3000,
            style: {
                ...baseStyle,
                backgroundColor: "#f8fafc",
                color: "#334155",
                borderColor: "#e2e8f0",
            },
        });
    }
}