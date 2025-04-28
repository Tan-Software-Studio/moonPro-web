import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// initialized instance
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: localStorage.getItem("i18nextLng") || "en",
        fallback: "en",
        returnObjects: true,
        resources: {
            ar: {
                translation: require("../public/languages/ar.json"),
            },
            ch: {
                translation: require("../public/languages/ch.json"),
            },
            en: {
                translation: require("../public/languages/en.json"),
            },
            gr: {
                translation: require("../public/languages/gr.json"),
            },
            gu: {
                translation: require("../public/languages/gu.json"),
            },
            hi: {
                translation: require("../public/languages/hi.json"),
            },
            it: {
                translation: require("../public/languages/it.json"),
            },
            ja: {
                translation: require("../public/languages/ja.json"),
            },
            kr: {
                translation: require("../public/languages/kr.json"),
            },
            sp: {
                translation: require("../public/languages/sp.json"),
            },
            sw: {
                translation: require("../public/languages/sw.json"),
            },
            ur: {
                translation: require("../public/languages/ur.json"),
            },
            vt: {
                translation: require("../public/languages/vt.json"),
            },
        },
    });
