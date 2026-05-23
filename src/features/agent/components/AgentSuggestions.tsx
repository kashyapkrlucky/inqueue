import { BotIcon } from "lucide-react";

export function AgentSuggestions() {
  const tryAskingSuggestions = [
    "I am thinking of learning swimming this week, Can you plan it for me?",
    "Can you rewrite these for me - 1. Go to the store, 2. Buy milk, 3. Come home",
    "Plan a trip from berlin to paris",
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
          <span
            key={index}
            className="inline-flex text-xs bg-white text-gray-600 border border-gray-200 rounded-lg p-2"
          >
            {suggestion}
          </span>
        ))}
      </div>
    </div>
  );
}
