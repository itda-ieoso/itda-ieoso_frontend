import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { collectVisibleTexts } from "../utils/collectVisibleTexts.js";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const browserLang = navigator.language.split("-")[0];

  const defaultTargetLang = ["ko", "en"].includes(browserLang)
    ? browserLang
    : "en";

  const [targetLang, setTargetLang] = useState(defaultTargetLang);

  const location = useLocation();

  const translateVisibleTexts = async (texts, lang = targetLang) => {
    if (lang === browserLang) {
      return;
    }

    if (texts.length === 0) return;

    const joinedText = texts.join("\n");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/translate`,
        {
          text: joinedText,
          sourceLang: "auto",
          targetLang: lang,
        },
      );

      const translatedArray = response.data.data.split("\n");

      const textNodes = [];

      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            if (!node.parentElement) return NodeFilter.FILTER_REJECT;
            if (node.parentElement.tagName === "SCRIPT")
              return NodeFilter.FILTER_REJECT;
            if (node.parentElement.tagName === "STYLE")
              return NodeFilter.FILTER_REJECT;
            if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        },
      );

      while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
      }
      for (let i = 0; i < textNodes.length && i < translatedArray.length; i++) {
        const node = textNodes[i];
        const parent = node.parentElement;
        const translateId = parent.getAttribute("data-translate-id");

        if (translateId === "day-월") node.nodeValue = "Mon";
        else if (translateId === "day-화") node.nodeValue = "Tue";
        else if (translateId === "day-수") node.nodeValue = "Wed";
        else if (translateId === "day-목") node.nodeValue = "Thu";
        else if (translateId === "day-금") node.nodeValue = "Fri";
        else if (translateId === "day-토") node.nodeValue = "Sat";
        else if (translateId === "day-일") node.nodeValue = "Sun";
        else node.nodeValue = translatedArray[i];
      }
    } catch (error) {
      console.error("번역 실패:", error);
    }
  };

  // 페이지 이동할 때 자동으로 다시 번역
  useEffect(() => {
    const doTranslate = async () => {
      if (targetLang === browserLang) {
        return;
      }
      const visibleTexts = collectVisibleTexts();
      await translateVisibleTexts(visibleTexts, targetLang);
    };

    doTranslate();
  }, [location.pathname, targetLang]);

  return (
    <LanguageContext.Provider
      value={{
        targetLang,
        setTargetLang,
        translateVisibleTexts,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
