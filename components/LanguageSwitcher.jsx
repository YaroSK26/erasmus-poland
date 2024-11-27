  // app/language-switcher.tsx
  "use client";
  import { useEffect, useState } from "react";

  export default function LanguageSwitcher() {
    const [language, setLanguage] = useState("sk");

    useEffect(() => {
      const storedLanguage = localStorage.getItem("language") || "sk";
      setLanguage(storedLanguage);
    }, []);

    const handleLanguageChange = (lang) => {
      localStorage.setItem("language", lang);
      setLanguage(lang);
      window.location.reload(); // Obnoví stránku, aby sa načítali texty v novom jazyku
    };

    return (
      <div className="flex gap-4">
        <button
          onClick={() => handleLanguageChange("pl")}
          className="flex items-center p-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          <img
            src="/pl.png"
            alt="Polish Flag"
            className="w-7  h-5 mr-2"
          />
          Polski
        </button>
        <button 
          onClick={() => handleLanguageChange("sk")}
          className="flex items-center p-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          <img
            src="/svk.png"
            alt="Slovak Flag"
            className="w-7 h-5 mr-2"
          />
          Slovensky
        </button>
      </div>
    );
  }