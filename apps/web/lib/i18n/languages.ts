export interface Language {
  value: string;
  label: string;
  native: string;
  flag: string;
  region: LanguageRegion;
}

export type LanguageRegion =
  | "auto"
  | "Southeast Asia"
  | "East Asia"
  | "South Asia"
  | "Middle East & Central Asia"
  | "Europe — Western"
  | "Europe — Eastern"
  | "Europe — Northern"
  | "Europe — Southern"
  | "Africa"
  | "Americas"
  | "Pacific";

export const AUTO_DETECT: Language = {
  value: "auto",
  label: "Auto Detect",
  native: "Deteksi Otomatis",
  flag: "🌐",
  region: "auto",
};

export const WHISPER_LANGUAGES: Language[] = [
  // Asia Tenggara
  {
    value: "id",
    label: "Indonesian",
    native: "Bahasa Indonesia",
    flag: "🇮🇩",
    region: "Southeast Asia",
  },
  {
    value: "ms",
    label: "Malay",
    native: "Bahasa Melayu",
    flag: "🇲🇾",
    region: "Southeast Asia",
  },
  {
    value: "jv",
    label: "Javanese",
    native: "Basa Jawa",
    flag: "🇮🇩",
    region: "Southeast Asia",
  },
  {
    value: "su",
    label: "Sundanese",
    native: "Basa Sunda",
    flag: "🇮🇩",
    region: "Southeast Asia",
  },
  {
    value: "tl",
    label: "Filipino (Tagalog)",
    native: "Filipino",
    flag: "🇵🇭",
    region: "Southeast Asia",
  },
  {
    value: "vi",
    label: "Vietnamese",
    native: "Tiếng Việt",
    flag: "🇻🇳",
    region: "Southeast Asia",
  },
  {
    value: "th",
    label: "Thai",
    native: "ภาษาไทย",
    flag: "🇹🇭",
    region: "Southeast Asia",
  },
  {
    value: "my",
    label: "Burmese",
    native: "မြန်မာဘာသာ",
    flag: "🇲🇲",
    region: "Southeast Asia",
  },
  {
    value: "km",
    label: "Khmer",
    native: "ភាសាខ្មែរ",
    flag: "🇰🇭",
    region: "Southeast Asia",
  },
  {
    value: "lo",
    label: "Lao",
    native: "ພາສາລາວ",
    flag: "🇱🇦",
    region: "Southeast Asia",
  },

  // Asia Timur
  {
    value: "zh",
    label: "Chinese (Mandarin)",
    native: "中文 (普通话)",
    flag: "🇨🇳",
    region: "East Asia",
  },
  {
    value: "ja",
    label: "Japanese",
    native: "日本語",
    flag: "🇯🇵",
    region: "East Asia",
  },
  {
    value: "ko",
    label: "Korean",
    native: "한국어",
    flag: "🇰🇷",
    region: "East Asia",
  },
  {
    value: "yue",
    label: "Cantonese",
    native: "粵語",
    flag: "🇭🇰",
    region: "East Asia",
  },

  // Asia Selatan
  {
    value: "hi",
    label: "Hindi",
    native: "हिन्दी",
    flag: "🇮🇳",
    region: "South Asia",
  },
  {
    value: "bn",
    label: "Bengali",
    native: "বাংলা",
    flag: "🇧🇩",
    region: "South Asia",
  },
  {
    value: "ur",
    label: "Urdu",
    native: "اردو",
    flag: "🇵🇰",
    region: "South Asia",
  },
  {
    value: "pa",
    label: "Punjabi",
    native: "ਪੰਜਾਬੀ",
    flag: "🇮🇳",
    region: "South Asia",
  },
  {
    value: "ta",
    label: "Tamil",
    native: "தமிழ்",
    flag: "🇮🇳",
    region: "South Asia",
  },
  {
    value: "te",
    label: "Telugu",
    native: "తెలుగు",
    flag: "🇮🇳",
    region: "South Asia",
  },
  {
    value: "mr",
    label: "Marathi",
    native: "मराठी",
    flag: "🇮🇳",
    region: "South Asia",
  },
  {
    value: "gu",
    label: "Gujarati",
    native: "ગુજરાતી",
    flag: "🇮🇳",
    region: "South Asia",
  },
  {
    value: "kn",
    label: "Kannada",
    native: "ಕನ್ನಡ",
    flag: "🇮🇳",
    region: "South Asia",
  },
  {
    value: "ml",
    label: "Malayalam",
    native: "മലയാളം",
    flag: "🇮🇳",
    region: "South Asia",
  },
  {
    value: "si",
    label: "Sinhala",
    native: "සිංහල",
    flag: "🇱🇰",
    region: "South Asia",
  },
  {
    value: "ne",
    label: "Nepali",
    native: "नेपाली",
    flag: "🇳🇵",
    region: "South Asia",
  },

  // Asia dan Timur Tengah
  {
    value: "ar",
    label: "Arabic",
    native: "العربية",
    flag: "🇸🇦",
    region: "Middle East & Central Asia",
  },
  {
    value: "fa",
    label: "Persian (Farsi)",
    native: "فارسی",
    flag: "🇮🇷",
    region: "Middle East & Central Asia",
  },
  {
    value: "tr",
    label: "Turkish",
    native: "Türkçe",
    flag: "🇹🇷",
    region: "Middle East & Central Asia",
  },
  {
    value: "he",
    label: "Hebrew",
    native: "עברית",
    flag: "🇮🇱",
    region: "Middle East & Central Asia",
  },
  {
    value: "kk",
    label: "Kazakh",
    native: "Қазақша",
    flag: "🇰🇿",
    region: "Middle East & Central Asia",
  },
  {
    value: "uz",
    label: "Uzbek",
    native: "O'zbek",
    flag: "🇺🇿",
    region: "Middle East & Central Asia",
  },
  {
    value: "az",
    label: "Azerbaijani",
    native: "Azərbaycan dili",
    flag: "🇦🇿",
    region: "Middle East & Central Asia",
  },

  // Eropa Barat
  {
    value: "en",
    label: "English",
    native: "English",
    flag: "🇬🇧",
    region: "Europe — Western",
  },
  {
    value: "fr",
    label: "French",
    native: "Français",
    flag: "🇫🇷",
    region: "Europe — Western",
  },
  {
    value: "de",
    label: "German",
    native: "Deutsch",
    flag: "🇩🇪",
    region: "Europe — Western",
  },
  {
    value: "es",
    label: "Spanish",
    native: "Español",
    flag: "🇪🇸",
    region: "Europe — Western",
  },
  {
    value: "pt",
    label: "Portuguese",
    native: "Português",
    flag: "🇧🇷",
    region: "Europe — Western",
  },
  {
    value: "nl",
    label: "Dutch",
    native: "Nederlands",
    flag: "🇳🇱",
    region: "Europe — Western",
  },
  {
    value: "it",
    label: "Italian",
    native: "Italiano",
    flag: "🇮🇹",
    region: "Europe — Western",
  },

  // Eropa Timur
  {
    value: "ru",
    label: "Russian",
    native: "Русский",
    flag: "🇷🇺",
    region: "Europe — Eastern",
  },
  {
    value: "pl",
    label: "Polish",
    native: "Polski",
    flag: "🇵🇱",
    region: "Europe — Eastern",
  },
  {
    value: "uk",
    label: "Ukrainian",
    native: "Українська",
    flag: "🇺🇦",
    region: "Europe — Eastern",
  },
  {
    value: "cs",
    label: "Czech",
    native: "Čeština",
    flag: "🇨🇿",
    region: "Europe — Eastern",
  },
  {
    value: "sk",
    label: "Slovak",
    native: "Slovenčina",
    flag: "🇸🇰",
    region: "Europe — Eastern",
  },
  {
    value: "bg",
    label: "Bulgarian",
    native: "Български",
    flag: "🇧🇬",
    region: "Europe — Eastern",
  },
  {
    value: "ro",
    label: "Romanian",
    native: "Română",
    flag: "🇷🇴",
    region: "Europe — Eastern",
  },
  {
    value: "hr",
    label: "Croatian",
    native: "Hrvatski",
    flag: "🇭🇷",
    region: "Europe — Eastern",
  },
  {
    value: "sr",
    label: "Serbian",
    native: "Српски",
    flag: "🇷🇸",
    region: "Europe — Eastern",
  },
  {
    value: "hu",
    label: "Hungarian",
    native: "Magyar",
    flag: "🇭🇺",
    region: "Europe — Eastern",
  },

  // Eropa Utara
  {
    value: "sv",
    label: "Swedish",
    native: "Svenska",
    flag: "🇸🇪",
    region: "Europe — Northern",
  },
  {
    value: "no",
    label: "Norwegian",
    native: "Norsk",
    flag: "🇳🇴",
    region: "Europe — Northern",
  },
  {
    value: "da",
    label: "Danish",
    native: "Dansk",
    flag: "🇩🇰",
    region: "Europe — Northern",
  },
  {
    value: "fi",
    label: "Finnish",
    native: "Suomi",
    flag: "🇫🇮",
    region: "Europe — Northern",
  },
  {
    value: "et",
    label: "Estonian",
    native: "Eesti",
    flag: "🇪🇪",
    region: "Europe — Northern",
  },
  {
    value: "lv",
    label: "Latvian",
    native: "Latviešu",
    flag: "🇱🇻",
    region: "Europe — Northern",
  },
  {
    value: "lt",
    label: "Lithuanian",
    native: "Lietuvių",
    flag: "🇱🇹",
    region: "Europe — Northern",
  },

  // Eropa Selatan
  {
    value: "el",
    label: "Greek",
    native: "Ελληνικά",
    flag: "🇬🇷",
    region: "Europe — Southern",
  },
  {
    value: "ca",
    label: "Catalan",
    native: "Català",
    flag: "🏴󠁥󠁳󠁣󠁴󠁿",
    region: "Europe — Southern",
  },
  {
    value: "gl",
    label: "Galician",
    native: "Galego",
    flag: "🇪🇸",
    region: "Europe — Southern",
  },
  {
    value: "eu",
    label: "Basque",
    native: "Euskara",
    flag: "🇪🇸",
    region: "Europe — Southern",
  },
  {
    value: "sl",
    label: "Slovenian",
    native: "Slovenščina",
    flag: "🇸🇮",
    region: "Europe — Southern",
  },
  {
    value: "sq",
    label: "Albanian",
    native: "Shqip",
    flag: "🇦🇱",
    region: "Europe — Southern",
  },
  {
    value: "mk",
    label: "Macedonian",
    native: "Македонски",
    flag: "🇲🇰",
    region: "Europe — Southern",
  },

  // Afrika
  {
    value: "sw",
    label: "Swahili",
    native: "Kiswahili",
    flag: "🇰🇪",
    region: "Africa",
  },
  {
    value: "af",
    label: "Afrikaans",
    native: "Afrikaans",
    flag: "🇿🇦",
    region: "Africa",
  },
  {
    value: "am",
    label: "Amharic",
    native: "አማርኛ",
    flag: "🇪🇹",
    region: "Africa",
  },
  {
    value: "yo",
    label: "Yoruba",
    native: "Yorùbá",
    flag: "🇳🇬",
    region: "Africa",
  },
  {
    value: "ha",
    label: "Hausa",
    native: "Hausa",
    flag: "🇳🇬",
    region: "Africa",
  },
  { value: "ig", label: "Igbo", native: "Igbo", flag: "🇳🇬", region: "Africa" },
  {
    value: "so",
    label: "Somali",
    native: "Soomaali",
    flag: "🇸🇴",
    region: "Africa",
  },

  // Americas
  {
    value: "qu",
    label: "Quechua",
    native: "Runa Simi",
    flag: "🇵🇪",
    region: "Americas",
  },
  {
    value: "ay",
    label: "Aymara",
    native: "Aymar aru",
    flag: "🇧🇴",
    region: "Americas",
  },
  {
    value: "ht",
    label: "Haitian Creole",
    native: "Kreyòl ayisyen",
    flag: "🇭🇹",
    region: "Americas",
  },

  // Pasifik
  {
    value: "mi",
    label: "Māori",
    native: "Te Reo Māori",
    flag: "🇳🇿",
    region: "Pacific",
  },
  {
    value: "haw",
    label: "Hawaiian",
    native: "ʻŌlelo Hawaiʻi",
    flag: "🇺🇸",
    region: "Pacific",
  },
];

export const ALL_LANGUAGES: Language[] = [AUTO_DETECT, ...WHISPER_LANGUAGES];

export function groupByRegion(
  languages: Language[],
): Record<string, Language[]> {
  return languages.reduce<Record<string, Language[]>>((acc, lang) => {
    const key = lang.region === "auto" ? "🌐 Auto" : lang.region;
    if (!acc[key]) acc[key] = [];
    acc[key].push(lang);
    return acc;
  }, {});
}

export function findLanguage(code: string): Language | undefined {
  return ALL_LANGUAGES.find((l) => l.value === code);
}
