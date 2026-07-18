import { BotIcon } from "lucide-react";
import { useAgentStore } from "../store/useAgentStore";

export function AgentSuggestions() {
  const { loading, sendMessage } = useAgentStore();
  const tryAskingSuggestions = [
    "What's pending today?",
    "Plan my day",
    "Move all low-priority tasks to tomorrow",
    "Create labels for my work and personal tasks",
    "Group these tasks by project",
  ];
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <BotIcon className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Start a conversation
      </h2>
      <p className="text-gray-500 max-w-md">
        Ask Tia AI anything about your tasks, schedule, or get help with
        productivity tips.
      </p>
      <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
        <span className="text-sm text-gray-600">Try asking:</span>
        {tryAskingSuggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            disabled={loading}
            onClick={() => sendMessage(suggestion)}
            className="inline-flex text-xs bg-white text-gray-600 border border-gray-200 rounded-lg p-2 transition-colors hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
