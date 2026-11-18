import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  ArrowUp,
  Bot,
  MessageCircle,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { API_URL } from "../config";

const suggestedPrompts = [
  "How do I find a stay?",
  "How do favourites work?",
  "Help me plan a weekend trip",
];

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (value = input) => {
    const text = value.trim();
    if (!text || isSending) return;

    const conversation = [...messages, { role: "user", content: text }];
    setMessages(conversation);
    setInput("");
    setErrorMessage("");
    setIsSending(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/chatbot`,
        { messages: conversation.slice(-10) },
        { withCredentials: true },
      );

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "I couldn't connect just now. Please try again.",
      );
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setErrorMessage("");
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="fixed bottom-24 right-4 z-60 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {isOpen && (
        <section
          aria-label="SmartStay AI chat"
          className="flex h-[min(36rem,calc(100dvh-8rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_24px_80px_rgba(28,32,43,0.22)] sm:w-96"
        >
          <header className="flex items-center justify-between bg-linear-to-r from-[#ff5a5f] to-[#ff858a] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
                <Bot size={23} />
              </span>
              <div>
                <h2 className="font-bold">SmartStay Assistant</h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/85">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Powered by Gemini
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={startNewChat}
                aria-label="Start a new chat"
                title="New chat"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white/90 transition hover:bg-white/15 hover:text-white"
              >
                <RotateCcw size={17} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white/90 transition hover:bg-white/15 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </header>

          <div
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto bg-[#fffdfd] px-4 py-5"
          >
            <div className="flex items-start gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fff0f0] text-[#ff5a5f]">
                <Sparkles size={16} />
              </span>
              <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-gray-100 bg-white px-3.5 py-3 text-sm leading-6 text-gray-700 shadow-sm">
                Hi! I’m your SmartStay assistant. Ask me about finding a home,
                using SmartStay, or planning your next trip.
              </div>
            </div>

            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`flex items-start gap-2.5 ${
                  message.role === "user" ? "justify-end" : ""
                }`}
              >
                {message.role === "assistant" && (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fff0f0] text-[#ff5a5f]">
                    <Bot size={16} />
                  </span>
                )}
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-tr-md bg-[#ff5a5f] text-white"
                      : "rounded-tl-md border border-gray-100 bg-white text-gray-700 shadow-sm"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {messages.length === 0 && !isSending && (
              <div className="ml-10 flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-[#ffd4d5] bg-white px-3 py-2 text-left text-xs font-medium text-[#d94b50] transition hover:border-[#ff5a5f] hover:bg-[#fff5f5]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {isSending && (
              <div className="flex items-start gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fff0f0] text-[#ff5a5f]">
                  <Bot size={16} />
                </span>
                <div
                  aria-label="Assistant is typing"
                  className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-gray-100 bg-white px-4 py-4 shadow-sm"
                >
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#ff858a]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#ff858a] [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#ff858a] [animation-delay:240ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-100 bg-white p-3">
            {errorMessage && (
              <p role="alert" className="mb-2 px-1 text-xs leading-5 text-red-600">
                {errorMessage}
              </p>
            )}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 transition focus-within:border-[#ff9a9e] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#ff5a5f]/10"
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                maxLength={2000}
                placeholder="Ask me anything..."
                aria-label="Message SmartStay Assistant"
                className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff5a5f] text-white shadow-sm transition hover:bg-[#ed4d52] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowUp size={19} />
              </button>
            </form>
            <p className="mt-2 text-center text-[10px] text-gray-400">
              AI responses can make mistakes. Don’t share sensitive information.
            </p>
          </div>
        </section>
      )}

      <button
        type="button"
        aria-label={isOpen ? "Close SmartStay Assistant" : "Chat with SmartStay"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="group flex h-14 items-center gap-2.5 rounded-full bg-[#ff5a5f] px-5 text-white shadow-[0_8px_28px_rgba(255,90,95,0.4)] transition hover:-translate-y-0.5 hover:bg-[#ed4d52] hover:shadow-[0_12px_32px_rgba(255,90,95,0.45)]"
      >
        {isOpen ? <X size={21} /> : <MessageCircle size={21} />}
        <span className="text-sm font-bold">
          {isOpen ? "Close" : "Ask SmartStay"}
        </span>
      </button>
    </div>
  );
}

export default Chatbot;
