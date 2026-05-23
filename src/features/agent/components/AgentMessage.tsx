import { CheckIcon, UserIcon } from "lucide-react";
import { useAgentStore, type Message } from "../store/useAgentStore";
import { Button } from "../../../shared/components/form/Button";

interface AgentMessageProps {
  message: Message;
}

export function AgentMessage({ message }: AgentMessageProps) {
  const hostUrl = import.meta.env.VITE_API_URL;
  const imgSrc = `${hostUrl}/apps/tia-ai.png`;

  const { addManyTasks, markDone } = useAgentStore();

  const onAddTasks = (data: { content: string; dueDate: string }[]) => {
    addManyTasks(
      data.map((item) => ({
        content: item.content,
        dueDate: new Date(item.dueDate),
      })),
    );
  };

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
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>

          {message?.actions && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Suggested Tasks
              </p>
              <div className="space-y-2 mb-3">
                {message.actions?.data?.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-xs py-2 px-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <span className="text-gray-700 font-medium">
                      {action.content}
                    </span>
                    <span className="text-gray-400 text-[11px]">
                      {action.dueDate}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                size="sm"
                disabled={message.actions?.isDone}
                onClick={() => {
                  onAddTasks(message.actions?.data || []);
                  markDone(message.id);
                }}
                className="w-full"
                variant={message.actions?.isDone ? "secondary" : "primary"}
                icon={
                  message.actions?.isDone ? (
                    <CheckIcon className="h-3 w-3" />
                  ) : undefined
                }
              >
                {message.actions?.isDone
                  ? "Tasks Added Successfully"
                  : "Add All Tasks to Board"}
              </Button>
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
