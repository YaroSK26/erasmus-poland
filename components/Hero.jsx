// components/Hero.tsx
"use client";
import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, when: "beforeChildren", staggerChildren: 0.2 },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  const [translations, setTranslations] = useState({
    welcome_message: "",
    description: "",
  });

  useEffect(() => {
    const language = localStorage.getItem("language") || "sk";
    import(`../public/locales/${language}.json`).then((module) =>
      setTranslations(module.default)
    );
  }, []);

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative w-full h-[500px] bg-cover bg-center"
      style={{ backgroundImage: "url('/ai-background.jpg')" }}
    >
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full px-4">
        <motion.h1
          variants={textVariants}
          className="text-5xl text-white font-extrabold mb-4"
        >
          {translations.welcome_message}
        </motion.h1>
        <motion.p
          variants={textVariants}
          className="text-white text-xl max-w-3xl mx-auto"
        >
          {translations.description}
        </motion.p>
      </div>
    </motion.section>
  );
}
