import { Loader2Icon } from "lucide-react";

export default function InlineLoader() {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Loader2Icon className="animate-spin w-6 h-6" />
        </div>
    )
}