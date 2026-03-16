"use client";

import { auth } from "@/app/lib/firebase";
import { Send } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslations } from "next-intl";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatCethaBotProps {
  onTypingChange?: (isTyping: boolean) => void;
}

const ChatCethaBot = ({ onTypingChange }: ChatCethaBotProps) => {
  const t = useTranslations("chatCethaBot");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    [],
  );
  const [username, setUsername] = useState<string | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.displayName) {
        setUsername(user.displayName);
      } else {
        setUsername(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll ke bawah setiap pesan baru muncul
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isBotTyping) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsBotTyping(true);
    onTypingChange?.(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, username }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requireUpgrade) {
          setUpgradeMessage(
            data.reply || data.error || t("errors.quotaExceeded"),
          );
          setShowUpgradeModal(true);
          return;
        }
      }

      const botMsg = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsBotTyping(false);
      onTypingChange?.(false);
    }
  };

  useEffect(() => {
    return () => onTypingChange?.(false);
  }, [onTypingChange]);

  return (
    <div className="bg-Background flex h-100 flex-col justify-between">
      {/* Pesan Chat */}
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "rounded-br-none bg-blue-600 text-white"
                  : "rounded-bl-none bg-gray-200 text-gray-800"
              }`}
            >
              {/* Gunakan ReactMarkdown untuk merender teks dari bot */}
              {msg.sender === "bot" ? (
                <ReactMarkdown
                  components={{
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mt-1 list-decimal space-y-1 pl-5">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li className="pl-1">{children}</li>,
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {children}
                      </a>
                    ),
                    p: ({ children }) => <p className="mb-1">{children}</p>,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}

        {isBotTyping && (
          <div className="flex justify-start">
            <div className="w-full max-w-[260px] space-y-2 rounded-xl rounded-bl-none bg-gray-200 px-4 py-3">
              <Skeleton className="h-3 w-[80%]" />
              <Skeleton className="h-3 w-[60%]" />
            </div>
          </div>
        )}

        {/* Referensi scroll ke bawah */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="sticky bottom-0 flex items-center gap-2 border-t bg-white px-3 pt-2 pb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className="flex-1 rounded-full border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={isBotTyping}
          className="rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} />
        </button>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        message={upgradeMessage}
      />
    </div>
  );
};

export default ChatCethaBot;
