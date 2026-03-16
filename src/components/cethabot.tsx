"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, BotMessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { auth } from "@/app/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

export default function CethaBot() {
  const t = useTranslations("cethaBotLegacy");
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    [],
  );
  const [isBotTyping, setIsBotTyping] = useState(false);

  // 🔹 Cek user login dari Firebase
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

  const sendMessage = async () => {
    if (!input.trim() || isBotTyping) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsBotTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, username }),
      });

      const data = await res.json();
      const botMsg = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsBotTyping(false);
    }
  };

  if (!username) return null;

  return (
    <div className="fixed right-8 bottom-8 z-50 flex flex-col items-end">
      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-3 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
              <div>
                <h2 className="text-sm font-semibold">{t("header.title")}</h2>
                <p className="text-xs opacity-80">
                  {isBotTyping
                    ? "Cetha sedang mengetik..."
                    : t("header.status")}
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white">
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="h-80 space-y-2 overflow-y-auto bg-gray-50 p-3">
              {messages.length === 0 && (
                <p className="mt-10 text-center text-sm text-gray-400">
                  {t("emptyMessage", { username })}
                </p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      msg.sender === "user"
                        ? "rounded-br-none bg-blue-600 text-white"
                        : "rounded-bl-none bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isBotTyping && (
                <div className="flex justify-start">
                  <div className="rounded-xl rounded-bl-none bg-gray-200 px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-2 w-2 rounded-full" />
                      <Skeleton className="h-2 w-2 rounded-full" />
                      <Skeleton className="h-2 w-2 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t bg-white px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("inputPlaceholder")}
                className="flex-1 rounded-full border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={isBotTyping}
                className="rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-18 w-18 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg"
      >
        <BotMessageSquare size={35} className="-scale-x-100 transform" />
      </motion.button>
    </div>
  );
}
