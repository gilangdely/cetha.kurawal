"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const HowUseCetha = () => {
  const t = useTranslations("cethaBotWidget.pages.howUse");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const messages = [
    { sender: "user", text: t("userQuestion") },
    {
      sender: "bot",
      text: t("intro"),
    },
    {
      sender: "bot",
      text: t("step1"),
    },
    {
      sender: "bot",
      text: t("step2"),
    },
    {
      sender: "bot",
      text: t("step3"),
    },
    {
      sender: "bot",
      text: t("step4"),
    },
    {
      sender: "bot",
      text: t("closing"),
    },
  ];

  // Scroll otomatis ke bawah setiap kali pesan dirender
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    // ❗ jangan pakai h-full agar tidak menutupi header global
    <div className="bg-Background max-h-[calc(100%-64px)] overflow-y-auto p-4 text-sm text-gray-700">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-3`}
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
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default HowUseCetha;
