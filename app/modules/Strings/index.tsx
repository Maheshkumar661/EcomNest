import i18n from "../i18n";

export const keys = {
  kSomethingWrong: "kSomethingWrong",
  kAddToCart: "kAddToCart",
  kCart: "kCart",
  kMatchYourStyle: "kMatchYourStyle",
  kFavorites: "kFavorites",
  kSearchPlaceholder: "kSearchPlaceholder",
  kTrendingNow: "kTrendingNow",
  kAll: "kAll",
  kNew: "kNew",
  kLoading: "kLoading",
  kNoProducts: "kNoProducts",
  kYourFavorites: "kYourFavorites",
  kNoFavorites: "kNoFavorites",
};

export const getStringForKey = (key: string): string => {
  return i18n.language[key] || key;
};

export const getDynamicStringForKey = (key: string, replaceArray: string[]) => {
  let fullTexts = i18n.language[key] || key;
  replaceArray.forEach((data) => {
    fullTexts = fullTexts.replace("{%s}", data);
  });
  return fullTexts;
};
