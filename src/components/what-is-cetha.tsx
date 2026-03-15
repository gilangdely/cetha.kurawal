"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const WhatIsCetha = () => {
  const t = useTranslations("cethaBotWidget.pages.whatIs");

  const messages = [
    { sender: "user", text: t("userQuestion") },
    {
      sender: "bot",
      text: t("botAnswer"),
    },
  ];

  return (
    <div className="bg-Background h-full overflow-y-auto p-4 text-sm text-gray-700">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
          className={`flex ${
            msg.sender === "user" ? "justify-end" : "justify-start"
          } mb-3`}
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
    </div>
  );
};

export default WhatIsCetha;
