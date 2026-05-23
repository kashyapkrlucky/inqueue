import { Button } from "../../../shared/components/form/Button";
import { SendIcon } from "lucide-react";
import Textarea from "../../../shared/components/form/Textarea";
import { useAgentStore } from "../store/useAgentStore";
import { useState } from "react";

export function AgentMessageForm() {
  const { sendMessage } = useAgentStore();

  const [inputValue, setInputValue] = useState("");
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setInputValue("");
    sendMessage(inputValue);
  };

  return (
    <footer className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Textarea
            id="agent-input"
            name="agent-input"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={2}
            boxClassName="flex-1"
            resize="none"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            variant="primary"
            icon={<SendIcon className="h-4 w-4" />}
            size="md"
            className="px-4 h-16"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </footer>
  );
}
