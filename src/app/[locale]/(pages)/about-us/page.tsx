"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  itemFadeLeft,
  itemFadeRight,
  itemFadeUp,
  sectionFadeUp,
  sectionStagger,
  sectionViewport,
} from "../../../../components/sections/section-motion";

import iyanImage from "@/assets/img/iyan.jpg";
import firmanImage from "@/assets/img/firman.jpg";
import gilangImage from "@/assets/img/gilang.jpg";
import Link from "next/link";
import { useState } from "react";

const profiles = [
  {
    id: 1,
    foto: iyanImage,
    nama: "Agus Priyanto",
    roleKey: "profiles.1.role",
  },
  {
    id: 2,
    foto: gilangImage,
    nama: "Gilang Dely",
    roleKey: "profiles.2.role",
  },
  {
    id: 3,
    foto: firmanImage,
    nama: "Firman Zamzami",
    roleKey: "profiles.3.role",
  },
];

const testimonialIds = ["1", "2", "3", "4", "5", "6", "7", "8"];

export default function AboutUsPage() {
  const t = useTranslations("AboutUsPage");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const testimonials = testimonialIds.map((id) => ({
    quote: t(`testimonials.items.${id}.quote`),
    name: t(`testimonials.items.${id}.name`),
    title: t(`testimonials.items.${id}.title`),
  }));

  const handleMail = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Contact from ${firstName} ${lastName}`);

    const body = encodeURIComponent(
      `Name: ${firstName} ${lastName}
       Email: ${email}

       Message:
       ${message}`,
    );

    window.location.href = `mailto:kurawal.creative@email.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-20 lg:pt-0">
      <motion.div
        variants={sectionStagger}
        initial="hidden"
        whileInView="show"
        viewport={sectionViewport}
        className="flex w-full flex-col items-center justify-center py-16 lg:pt-28"
      >
        <motion.div
          variants={sectionFadeUp}
          className="flex max-w-2xl flex-col items-center text-center"
        >
          {/* Badge */}
          <div className="border-primaryBlue/30 bg-primaryBlue/5 text-primaryBlue rounded-full border px-4 py-1.5 text-sm font-medium tracking-wide">
            {t("hero.badge")}
          </div>

          {/* Title */}
          <div className="mt-4 max-w-2xl">
            <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
              {t("hero.title")}
            </h2>

            {/* Description */}
            <p className="text-TextSecondary mt-2 text-base md:text-lg">
              {t("hero.description")}
            </p>
          </div>

          <div className="mt-6 flex flex-row gap-3">
            <a
              href="https://kurawal.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="group border-primaryBlue text-primaryBlue hover:border-primaryBlueHover hover:bg-primaryBlue/5 hover:text-primaryBlueHover focus-visible:ring-primaryBlue flex w-full items-center justify-center gap-2 rounded-full border-2 px-4 py-1.5 whitespace-nowrap transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:w-fit"
            >
              <Globe
                size={16}
                className="shrink-0 transition-transform duration-200 group-hover:rotate-6"
              />
              <span>{t("hero.visitProfile")}</span>
            </a>

            <Link
              href="#contact-us"
              onClick={(event) => {
                event.preventDefault();
                document
                  .getElementById("contact-us")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="group bg-primaryBlue hover:bg-primaryBlueHover focus-visible:ring-primaryBlue flex w-full items-center justify-center gap-2 rounded-full px-4 py-1.5 font-semibold whitespace-nowrap text-white shadow-sm transition-all duration-200 ease-out hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] md:w-fit"
            >
              {t("hero.contactButton")}
            </Link>
          </div>
        </motion.div>
        <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile, idx) => (
            <motion.div
              key={profile.id}
              variants={itemFadeUp}
              transition={{ delay: idx * 0.08 }}
              className="relative"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src={profile.foto}
                  alt={profile.nama}
                  className="h-80 w-full object-cover grayscale"
                />
              </div>

              {/* Card Overlay */}
              <div className="absolute bottom-[10px] left-1/2 w-[85%] -translate-x-1/2 rounded-lg bg-white p-2 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900">
                  {profile.nama}
                </h3>
                <p className="mt-0.5 text-sm text-gray-500">
                  {t(profile.roleKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        variants={sectionFadeUp}
        initial="hidden"
        whileInView="show"
        viewport={sectionViewport}
        className="mx-auto w-full px-4 py-16 sm:px-6 lg:py-20"
      >
        <motion.div
          className="flex flex-col items-center text-center"
          variants={itemFadeUp}
          initial="hidden"
          whileInView="show"
          viewport={sectionViewport}
        >
          <div className="border-primaryBlue/30 bg-primaryBlue/5 text-primaryBlue w-fit rounded-full border px-4 py-1.5 text-sm font-medium tracking-wide">
            {t("testimonials.badge")}
          </div>
          <div className="mt-4 max-w-3xl flex-col text-center">
            <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
              {t("testimonials.titleLine1")} <br className="hidden md:block" />
              {t("testimonials.titleLine2")}
            </h2>
            <p className="text-TextSecondary mt-2 text-base lg:text-lg">
              {t("testimonials.description")}
            </p>
          </div>
        </motion.div>

        <div className="py-10">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
          <InfiniteMovingCards
            items={testimonials}
            direction="left"
            speed="slow"
          />
        </div>
      </motion.div>

      {/* Get in touch */}
      <motion.div
        id="contact-us"
        variants={sectionFadeUp}
        initial="hidden"
        whileInView="show"
        viewport={sectionViewport}
        className="py-8 md:py-12"
      >
        <div className="flex w-full justify-center">
          <motion.div
            variants={itemFadeUp}
            className="flex max-w-2xl flex-col items-center text-center"
          >
            {/* Badge */}
            <div className="border-primaryBlue/30 bg-primaryBlue/5 text-primaryBlue w-fit rounded-full border px-4 py-1.5 text-sm font-medium tracking-wide">
              {t("contact.badge")}
            </div>

            {/* Title */}
            <div className="mt-4 max-w-2xl">
              <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
                {t("contact.title")}
              </h2>

              {/* Description */}
              <p className="text-TextSecondary mt-2 text-base md:text-lg">
                {t("contact.description")}
              </p>
            </div>
          </motion.div>
        </div>
        <div className="mx-auto mt-10 grid w-full max-w-5xl gap-12 px-6 md:grid-cols-2">
          {/* LEFT - FORM */}
          <motion.div variants={itemFadeLeft}>
            <form onSubmit={handleMail} className="space-y-4 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("contact.form.firstNameLabel")}
                  </label>
                  <input
                    type="text"
                    className="focus:border-primaryBlue focus:ring-primaryBlue mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"
                    placeholder={t("contact.form.firstNamePlaceholder")}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("contact.form.lastNameLabel")}
                  </label>
                  <input
                    type="text"
                    className="focus:border-primaryBlue focus:ring-primaryBlue mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"
                    placeholder={t("contact.form.lastNamePlaceholder")}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t("contact.form.emailLabel")}
                </label>
                <input
                  type="email"
                  className="focus:border-primaryBlue focus:ring-primaryBlue mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"
                  placeholder={t("contact.form.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t("contact.form.messageLabel")}
                </label>
                <textarea
                  rows={4}
                  className="focus:border-primaryBlue focus:ring-primaryBlue mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"
                  placeholder={t("contact.form.messagePlaceholder")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="bg-primaryBlue hover:bg-primaryBlueHover w-full rounded-lg py-3 font-semibold text-white transition-all duration-200"
              >
                {t("contact.form.submitButton")}
              </button>
            </form>
          </motion.div>

          {/* RIGHT - CONTACT INFO */}
          <motion.div
            variants={itemFadeRight}
            className="flex flex-col gap-8 p-4"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("contact.info.contactTitle")}
              </h3>
              <p className="mt-1 text-gray-600">
                {t("contact.info.contactDescription")}
              </p>

              <div className="mt-2 flex items-center gap-3 text-gray-700">
                <Phone size={18} />
                <span>{t("contact.info.phone")}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("contact.info.emailTitle")}
              </h3>
              <div className="mt-2 flex items-center gap-3 text-gray-700">
                <Mail size={18} />
                <span>{t("contact.info.email")}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("contact.info.addressTitle")}
              </h3>
              <div className="mt-2 flex items-start gap-3 text-gray-700">
                <MapPin size={18} />
                <span>{t("contact.info.address")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
