"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BotMessageSquare,
  MoveRight,
  ChevronRight,
  EllipsisVertical,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { auth } from "@/app/lib/firebase";

import Favicon from "@/assets/icons/favicon-blue-new.svg";
import ChatCethaBot from "./chat-cetha-bot";
import WhatIsCetha from "./what-is-cetha";
import HowCethaWorks from "./how-cetha-works";
import HowUseCetha from "./how-use-cetha";

export default function CethaBot() {
  const t = useTranslations("cethaBotWidget");
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activePage, setActivePage] = useState("home");

  const FAQs = [
    {
      id: 1,
      faq: t("faqs.whatIs"),
      page: "what-is-cetha",
    },
    {
      id: 2,
      faq: t("faqs.howWorks"),
      page: "how-cetha-works",
    },
    {
      id: 3,
      faq: t("faqs.howUse"),
      page: "how-use-cetha",
    },
  ];

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

  useEffect(() => {
    if (!isOpen) {
      setShowChat(false);
      setShowMenu(false);
      setActivePage("home");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!showChat) setShowMenu(false);
  }, [showChat]);

  const handleFAQClick = (page: string) => {
    if (page) setActivePage(page);
  };

  const handleBackToHome = () => {
    setActivePage("home");
    setShowChat(false);
  };

  if (!username) return null;

  return (
    <div className="fixed right-4 bottom-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-Background mb-3 h-120 w-90 overflow-hidden rounded-2xl shadow-2xl"
          >
            {/* Header */}
            {(showChat ||
              activePage === "what-is-cetha" ||
              activePage === "how-cetha-works" ||
              activePage === "how-use-cetha") && (
              <div className="relative">
                <div className="text-TextPrimary flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 text-sm">
                  {/* Kiri: Tombol Kembali + Info */}
                  <div className="flex items-center gap-2">
                    <Image
                      src={Favicon}
                      alt={t("header.iconAlt")}
                      className="h-12 w-12"
                    />
                    <div className="flex-col">
                      <h2 className="text-sm font-semibold">
                        {activePage === "what-is-cetha"
                          ? t("header.titles.whatIs")
                          : activePage === "how-cetha-works"
                            ? t("header.titles.howWorks")
                            : activePage === "how-use-cetha"
                              ? t("header.titles.howUse")
                              : t("header.titles.default")}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {activePage === "what-is-cetha"
                          ? t("header.descriptions.whatIs")
                          : activePage === "how-cetha-works"
                            ? t("header.descriptions.howWorks")
                            : activePage === "how-use-cetha"
                              ? t("header.descriptions.howUse")
                              : t("header.descriptions.default")}
                      </p>
                    </div>
                  </div>

                  {/* Ellipsis */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu((prev) => !prev)}
                      className="rounded-full p-1 hover:bg-gray-100"
                    >
                      <EllipsisVertical size={20} />
                    </button>

                    {showMenu && (
                      <div className="absolute right-0 z-10 mt-2 w-32 rounded-lg border border-gray-200 bg-white shadow-lg">
                        <button
                          onClick={() => {
                            handleBackToHome();
                            setShowMenu(false);
                          }}
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          {t("menu.back")}
                        </button>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            setShowMenu(false);
                            setShowChat(false);
                          }}
                          className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
                        >
                          {t("menu.close")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Content Area */}
            {activePage === "home" && !showChat ? (
              <div className="text-TextPrimary flex flex-col items-center justify-between px-4 py-3">
                <div className="space-y-3">
                  <Image
                    src={Favicon}
                    className="h-15 w-15"
                    alt={t("home.logoAlt")}
                  />
                  <div>
                    <h2 className="text-xl font-semibold">
                      {t("home.greeting", { username })}
                    </h2>
                    <p className="text-TextSecondary mt-2 text-sm">
                      {t("home.description")}
                    </p>
                  </div>
                  <div className="space-y-1.5 rounded-xl border border-gray-200 bg-white p-2.5 text-sm shadow-sm">
                    <h2 className="text-TextPrimary text-base font-semibold">
                      {t("home.onlineCard.title")}
                    </h2>
                    <p className="text-TextSecondary font-medium">
                      {t("home.onlineCard.description")}
                    </p>
                    <button
                      onClick={() => setShowChat(true)}
                      className="text-primaryBlue group hover:border-primaryBlue mt-4 flex w-fit cursor-pointer items-center gap-2 border-b-2 border-transparent font-semibold"
                    >
                      {t("home.onlineCard.startButton")} <MoveRight size={16} />
                    </button>
                  </div>
                  <div className="space-y-1.5 rounded-xl border border-gray-200 bg-white p-2.5 text-sm shadow-sm">
                    <h2 className="text-TextPrimary text-base font-semibold">
                      {t("home.popularTitle")}
                    </h2>
                    <div className="mt-4 w-full space-y-3">
                      {FAQs.map((faq) => (
                        <button
                          key={faq.id}
                          onClick={() => faq.page && handleFAQClick(faq.page)}
                          className="text-TextSecondary group hover:text-TextPrimary flex w-full cursor-pointer items-center justify-between font-semibold"
                        >
                          <span className="group-hover:border-TextPrimary border-b-2 border-transparent transition">
                            {faq.faq}
                          </span>
                          <ChevronRight
                            size={16}
                            className="text-TextSecondary group-hover:text-TextPrimary transition"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : activePage === "what-is-cetha" ? (
              <WhatIsCetha />
            ) : activePage === "how-cetha-works" ? (
              <HowCethaWorks />
            ) : activePage === "how-use-cetha" ? (
              <HowUseCetha />
            ) : (
              <ChatCethaBot />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg lg:h-16 lg:w-16"
      >
        <BotMessageSquare size={35} className="-scale-x-100 transform" />
      </motion.button>
    </div>
  );
}
