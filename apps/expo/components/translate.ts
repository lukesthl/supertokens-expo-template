import * as Localization from "expo-localization";
import de from "../constants/translation/de.json";
import en from "../constants/translation/en.json";
import i18next from "i18next";

export const translate = {
  t: i18next.t,
  init: () => {
    i18next.init({
      compatibilityJSON: "v3",
      lng: Localization.locale,
      fallbackLng: "en",
      resources: { de, en },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  },
};
