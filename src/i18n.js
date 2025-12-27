// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation resources
const resources = {
  en: {
    translation: {
      // Common labels
      details: "Details",
      high: "High",
      low: "Low",
      loading: "Loading...",

      // Regions (labels)
      Center: "Center",
      South: "South",
      North: "North",
      Bekaa: "Bekaa",

      // Cities (keys must match lebanonRegions[].key)
      Tripoli: "Tripoli",
      Zgharta: "Zgharta",
      Bcharre: "Bcharre",
      Batroun: "Batroun",
      Koura: "Koura",
      Akkar: "Akkar",

      Beirut: "Beirut",
      Jounieh: "Jounieh",
      Byblos: "Byblos (Jbeil)",
      Keserwan: "Keserwan",
      Baabda: "Baabda",
      Aley: "Aley",
      Chouf: "Chouf",
      Metn: "Metn",

      Saida: "Saida (Sidon)",
      Tyre: "Tyre (Sour)",
      Jezzine: "Jezzine",
      Nabatieh: "Nabatieh",
      BintJbeil: "Bint Jbeil",
      Marjayoun: "Marjayoun",
      Hasbaya: "Hasbaya",

      Zahle: "Zahle",
      Baalbek: "Baalbek",
      Hermel: "Hermel",
      Rashaya: "Rashaya",
    },
  },
  ar: {
    translation: {
      // Common labels
      details: "التفاصيل",
      high: "العظمى",
      low: "الصغرى",
      loading: "جار التحميل...",

      // Regions
      Center: "الوسط",
      South: "الجنوب",
      North: "الشمال",
      Bekaa: "البقاع",

      // Cities
      Tripoli: "طرابلس",
      Zgharta: "زغرتا",
      Bcharre: "بشري",
      Batroun: "البترون",
      Koura: "الكورة",
      Akkar: "عكار",

      Beirut: "بيروت",
      Jounieh: "جونية",
      Byblos: "جبيل",
      Keserwan: "كسروان",
      Baabda: "بعبدا",
      Aley: "عاليه",
      Chouf: "الشوف",
      Metn: "المتن",

      Saida: "صيدا",
      Tyre: "صور",
      Jezzine: "جزين",
      Nabatieh: "النبطية",
      BintJbeil: "بنت جبيل",
      Marjayoun: "مرجعيون",
      Hasbaya: "حاصبيا",

      Zahle: "زحلة",
      Baalbek: "بعلبك",
      Hermel: "الهرمل",
      Rashaya: "راشيا",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
