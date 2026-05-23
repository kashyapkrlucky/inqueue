import { Button } from "../../../shared/components/form/Button";
import useAuthStore from "../../auth/store/useAuthStore";
import { useEffect, useRef, useState } from "react";
import { useAgentStore, type Message } from "../store/useAgentStore";
import { BotIcon, UserIcon, SendIcon, CheckIcon } from "lucide-react";

export default function Agent() {
  const hostUrl = import.meta.env.VITE_API_URL;
  const imgSrc = `${hostUrl}/apps/tia-ai.png`;
  const { user } = useAuthStore();

  const { messages, sendMessage, addManyTasks, markDone } = useAgentStore();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      })),
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={imgSrc} 
              alt="Tia AI" 
              className="w-32 h-32 rounded-full border-2 border-purple-400"
            />
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Welcome {user?.name}!</h1>
              <p className="text-sm text-gray-500">How can I help you today?</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <section className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <BotIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Start a conversation
              </h2>
              <p className="text-gray-500 max-w-md">
                Ask Tia AI anything about your tasks, schedule, or get help with productivity tips.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message: Message) => (
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
                  
                  <div className={`flex-1 max-w-[70%] ${message.isUser ? "flex flex-col items-end" : ""}`}>
                    <div
                      className={`px-5 py-3 shadow-sm ${
                        message.isUser
                          ? "bg-gray-900 text-white rounded-2xl rounded-tr-sm"
                          : "bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      
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
                                <span className="text-gray-700 font-medium">{action.content}</span>
                                <span className="text-gray-400 text-[11px]">{action.dueDate}</span>
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
                            {message.actions?.isDone ? "Tasks Added Successfully" : "Add All Tasks to Board"}
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-[11px] text-gray-400 mt-1.5">
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
          )}
        </div>
      </section>

      {/* Input Area */}
      <footer className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <textarea
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 resize-none"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              variant="primary"
              icon={<SendIcon className="h-4 w-4" />}
              size="md"
              className="px-4"
            >
              Send
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </footer>
    </div>
  );
}
