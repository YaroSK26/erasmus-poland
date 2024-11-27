"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { Brain, Bot, Car, Cpu, Image, MessageSquare } from "lucide-react";

export default function Timeline() {
  const [translations, setTranslations] = useState(null); // Set to null initially to check loading state

  useEffect(() => {
    const loadTranslations = async () => {
      const language = localStorage.getItem("language") || "sk";
      const translationsModule = await import(
        `../public/locales/${language}.json`
      );
      setTranslations(translationsModule.default);
    };

    loadTranslations();
  }, []);

  if (!translations) {
    return <p>Načitavanie...</p>; 
  }

  const events = [
    { year: 1956, event: translations.events[0].event, icon: Brain },
    { year: 1966, event: translations.events[1].event, icon: MessageSquare },
    { year: 1997, event: translations.events[2].event, icon: Bot },
    { year: 2002, event: translations.events[3].event, icon: Car },
    { year: 2006, event: translations.events[4].event, icon: Cpu },
    { year: 2012, event: translations.events[5].event, icon: Image },
    { year: 2016, event: translations.events[6].event, icon: Brain },
    { year: 2021, event: translations.events[7].event, icon: Bot },
    { year: 2023, event: translations.events[8].event, icon: Image },
  ];

  return (
    <section className="py-16 bg-[#F6FAFF]">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-8 md:mb-16 text-gray-800">
          {translations.timeline_title}
        </h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-blue-200 transform md:-translate-x-1/2"></div>
          {events.map((event, index) => (
            <TimelineEvent key={index} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineEvent({ event, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const Icon = event.icon;

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className={`flex flex-col md:flex-row items-start md:items-center mb-8 ${
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      <div className="w-full md:w-5/12 mb-4 md:mb-0">
        <div
          className={`bg-white p-4 md:pl-0 pl-8 md:p-6 rounded-lg shadow-lg ${
            index % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"
          }`}
        >
          <span className="text-xl md:text-2xl font-bold text-blue-600">
            {event.year}
          </span>
          <p className="mt-2 text-sm md:text-base text-gray-700">
            {event.event}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-start md:justify-center w-full md:w-2/12 md:pl-0">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center z-10">
          {Icon && <Icon color="#fff" size={20} />}
        </div>
      </div>
      <div className="hidden md:block md:w-5/12"></div>
    </motion.div>
  );
}
