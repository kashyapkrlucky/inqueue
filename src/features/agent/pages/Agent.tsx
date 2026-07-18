import { useEffect, useRef } from "react";
import { useAgentStore, type Message } from "../store/useAgentStore";
import { AgentPageHeader } from "../components/AgentPageHeader";
import { AgentSuggestions } from "../components/AgentSuggestions";
import { AgentMessage } from "../components/AgentMessage";
import { AgentMessageForm } from "../components/AgentMessageForm";

export default function Agent() {
  const { messages, loading } = useAgentStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <AgentPageHeader />

      {/* Messages Area */}
      <section className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            <AgentSuggestions />
          ) : (
            <div className="space-y-6">
              {messages.map((message: Message) => (
                <AgentMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
              {loading && (
                <AgentMessage
                  message={{
                    id: "agent-working",
                    text: "Working...",
                    isUser: false,
                    timestamp: new Date(),
                  }}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Input Area */}
      <AgentMessageForm />
    </div>
  );
}
