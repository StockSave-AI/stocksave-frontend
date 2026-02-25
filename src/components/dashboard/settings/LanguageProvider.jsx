import { useState } from "react";
import { translations } from "./language";
import { LangContext } from "./languageContext";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}
