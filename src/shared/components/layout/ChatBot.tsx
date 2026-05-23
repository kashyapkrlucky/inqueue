import { useState, useRef, useEffect } from "react";
import {
  XIcon,
  SendIcon,
  Minimize2Icon,
  MessageSquareIcon,
} from "lucide-react";
import Input from "../form/Input";
import { Button } from "../form/Button";
import { useAgentStore, type Message } from "../../../features/agent/store/useAgentStore";

export default function ChatBot() {
  const {messages, sendMessage, addManyTasks, markDone} = useAgentStore();
  const hostUrl = import.meta.env.VITE_API_URL;
  const imgSrc = `${hostUrl}/apps/tia-ai.png`;
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    setInputValue("");
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const onAddTasks = (data: { content: string; dueDate: string }[]) => {
    addManyTasks(
      data.map((item) => ({
        content: item.content,
        dueDate: new Date(item.dueDate),
      }))
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div className="mb-4 w-96 rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3">
            <div className="flex items-center gap-3">
              <img
                src={imgSrc}
                alt="Ask Tia"
                className="h-16 w-16 rounded-full bg-white"
              />
              <div>
                <h3 className="font-semibold text-white">Ask Tia</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="rounded-lg p-1.5 text-white hover:bg-indigo-400/30 transition"
              >
                <Minimize2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white hover:bg-indigo-400/30 transition"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.isUser
                      ? "bg-indigo-500 text-white rounded-br-md"
                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                  }`}
                >
                  <p className="text-xs leading-relaxed">{message.text}</p>
                  {message?.actions && (
                    <>
                      {message.actions?.data?.map((action, index) => (
                        <p key={index} className="text-xs mt-1 text-gray-600">
                          {action.content} - {action.dueDate}
                        </p>
                      ))}

                      <Button
                        className="mt-2"
                        size="sm"
                        disabled={message.actions?.isDone}
                        onClick={() => {
                          onAddTasks(message.actions?.data || []);
                          markDone(message.id);
                        }}
                      >
                        Add Task to my board
                      </Button>
                    </>
                  )}
                  <p
                    className={`text-[10px] mt-1 ${
                      message.isUser ? "text-indigo-100" : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                boxClassName="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                variant="primary"
                size="sm"
              >
                <SendIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized Chat Bar */}
      {isOpen && isMinimized && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white shadow-lg border border-gray-200 px-4 py-3">
          <img src={imgSrc} alt="Ask Tia" className="h-8 w-8 rounded-full" />
          <span className="text-sm font-medium text-gray-900">
            Ask Tia Chat
          </span>
          <button
            onClick={() => setIsMinimized(false)}
            className="ml-auto rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 transition"
          >
            <MessageSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 transition"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-30 w-30 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <img
            src={imgSrc}
            alt="Ask Tia"
            className="h-28 w-28 rounded-full bg-white"
          />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 border-2 border-white">
            <span className="sr-only">Online</span>
          </span>
        </button>
      )}
    </div>
  );
}
