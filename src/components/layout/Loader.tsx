import { Loader2Icon } from "lucide-react";

export default function Loader() {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2Icon className="animate-spin w-12 h-12" />
        </div>
    )
}