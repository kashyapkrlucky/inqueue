import { Button } from "../../../shared/components/form/Button";
import useAuthStore from "../../auth/store/useAuthStore";
import { useAgentStore } from "../store/useAgentStore";

export function AgentPageHeader() {
  const { clearMessages, messages } = useAgentStore();
  const { user } = useAuthStore();
  const hostUrl = import.meta.env.VITE_API_URL;
  const imgSrc = `${hostUrl}/apps/tia-ai.png`;
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={imgSrc}
            alt="Tia AI"
            className="w-32 h-32 rounded-full border-2 border-purple-400"
          />
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Welcome {user?.name}!
            </h1>
            <p className="text-sm text-gray-500">
              I am Tia, how can I help you today?
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <Button onClick={clearMessages}>Clear Chat</Button>
        )}
      </div>
    </header>
  );
}
