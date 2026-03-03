"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Mail, MapPin, Phone, Facebook, Instagram, Globe } from "lucide-react";
import { useTranslations } from "next-intl";

import logo from "@/assets/icons/cetha-logo-white.svg";

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mt-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 pt-12 text-gray-300"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Brand & Deskripsi */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link href="/" className="flex items-center gap-3">
            <Image src={logo} alt="logo" priority />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
            {t("description")}
          </p>
          <div className="mt-4 flex gap-4">
            {[
              {
                href: "https://www.instagram.com/kurawal.creative/?hl=id",
                icon: <Instagram size={20} />,
                color: "#E1306C",
              },
              {
                href: "https://www.facebook.com/profile.php?id=61578699331169",
                icon: <Facebook size={20} />,
                color: "#1877F2",
              },
              {
                href: "https://kurawal.site/",
                icon: <Globe size={20} />,
                color: "#f97316",
              },
            ].map((sosmed, i) => (
              <motion.a
                key={i}
                href={sosmed.href}
                target="_blank"
                whileHover={{ scale: 1.15, color: sosmed.color }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {sosmed.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-6 text-sm"
        >
          <div>
            <h3 className="mb-3 text-lg font-semibold text-white">
              {t("navigation.title")}
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/review-cv", label: t("navigation.reviewCv") },
                {
                  href: "/tingkatkan-linkedIn",
                  label: t("navigation.reviewLinkedin"),
                },
                { href: "/tips-karir", label: t("navigation.blog") },
                { href: "/daftar-harga", label: t("navigation.pricing") },
                { href: "/tentang-kami", label: t("navigation.about") },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className="hover:text-primaryBlue transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold text-white">
              {t("other.title")}
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/faq", label: t("other.faq") },
                { href: "/hubungi-kami", label: t("other.contact") },
                { href: "/kebijakan-privasi", label: t("other.privacy") },
                { href: "/syarat-ketentuan", label: t("other.terms") },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className="hover:text-primaryBlue transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Kontak */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm"
        >
          <h3 className="mb-3 text-lg font-semibold text-white">
            {t("contact.title")}
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Phone size={16} /> {t("contact.phone")}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> {t("contact.email")}
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> {t("contact.location")}
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-10 border-t border-gray-700 py-4 text-center text-xs text-white"
      >
        © {new Date().getFullYear()} Cetha. {t("copyright")}
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
