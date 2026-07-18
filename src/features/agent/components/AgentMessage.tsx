import type { ReactNode } from "react";
import {
  CheckCircle2Icon,
  CircleIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react";
import type { AgentResult, Message } from "../store/useAgentStore";
import { AgentMarkdown } from "./AgentMarkdown";

interface AgentMessageProps {
  message: Message;
}

const resultStyles: Record<AgentResult["status"], string> = {
  executed: "bg-green-50 text-green-700 border-green-200",
  skipped: "bg-gray-50 text-gray-600 border-gray-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

const resultIcons: Record<AgentResult["status"], ReactNode> = {
  executed: <CheckCircle2Icon className="h-3.5 w-3.5" />,
  skipped: <CircleIcon className="h-3.5 w-3.5" />,
  failed: <XCircleIcon className="h-3.5 w-3.5" />,
};

export function AgentMessage({ message }: AgentMessageProps) {
  const hostUrl = import.meta.env.VITE_AUTH_URL;
  const imgSrc = `${hostUrl}/apps/tia-ai.png`;

  return (
    <div
      key={message.id}
      className={`flex gap-4 ${
        message.isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="flex-shrink-0">
        {message.isUser ? (
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
        ) : (
          <img
            src={imgSrc}
            alt="Tia AI"
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
          />
        )}
      </div>

      <div
        className={`flex-1 max-w-[70%] ${message.isUser ? "flex flex-col items-end" : ""}`}
      >
        <div
          className={`px-5 py-3 shadow-sm ${
            message.isUser
              ? "bg-gray-900 text-white rounded-2xl rounded-tr-sm"
              : "bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-tl-sm"
          }`}
        >
          <AgentMarkdown content={message.text} isUser={message.isUser} />

          {message.results && message.results.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Actions
              </p>
              <div className="space-y-2">
                {message.results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 text-xs py-2 px-3 rounded-lg border ${resultStyles[result.status]}`}
                  >
                    <span className="mt-0.5 flex-shrink-0">
                      {resultIcons[result.status]}
                    </span>
                    <div>
                      <p className="font-semibold capitalize">
                        {result.status}: {result.action}
                      </p>
                      <p className="mt-0.5">{result.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-400 mt-1.5">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
