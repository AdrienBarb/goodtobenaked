export interface Carrier {
  label: "mondial_relay_pointrelais" | "colissimo_home";
  description: string;
}

export interface SupportedCountry {
  value: string;
  label: string;
}

export type Notification = "profile_viewed";

export const HELP_EMAIL = "help@goodtobenaked.com";
export const SUBSCRIPTION = "subscription";
export const PRODUCT_SALE = "productSale";

export const MANUAL_SHIPPING = "manual";

export const supportedCountry = [
  {
    value: "FR",
    label: "France",
  },
  {
    value: "BE",
    label: "Belgique",
  },
  {
    value: "DE",
    label: "Allemagne",
  },
  {
    value: "AT",
    label: "Autriche",
  },
  {
    value: "DK",
    label: "Danemark",
  },
  {
    value: "ES",
    label: "Espagne",
  },
  {
    value: "FI",
    label: "Finlande",
  },
  {
    value: "GR",
    label: "Grèce",
  },
  {
    value: "HU",
    label: "Hongrie",
  },
  {
    value: "IE",
    label: "Irlande",
  },
  {
    value: "IT",
    label: "Italie",
  },
  {
    value: "LU",
    label: "Luxembourg",
  },
  {
    value: "NO",
    label: "Norvège",
  },
  {
    value: "NL",
    label: "Pays-Bas",
  },
  {
    value: "PL",
    label: "Pologne",
  },
  {
    value: "PT",
    label: "Portugal",
  },
  {
    value: "GB",
    label: "Royaume-Uni",
  },
  {
    value: "SE",
    label: "Suède",
  },
  {
    value: "CH",
    label: "Suisse",
  },
  {
    value: "US",
    label: "États-Unis",
  },
  {
    value: "CA",
    label: "Canada",
  },
];

export const CARRIERS: Carrier[] = [
  {
    label: "mondial_relay_pointrelais",
    description: "mondial_relay_pointrelais_description",
  },
  {
    label: "colissimo_home",
    description: "colissimo_home_description",
  },
];

export const USER_INAPP_NOTIFICATION: Notification[] = ["profile_viewed"];

export const LIMIT_PRODUCT = 24;
export const LIMIT_CREATOR = 24;
export const LIMIT_MEDIA = 36;
export const LIMIT_PROFIL = 24;

export type TagsType = {
  value: string;
  label: string;
};

export const tagList = [
  "anal",
  "asian",
  "bbw",
  "bigDick",
  "bigTits",
  "bikini",
  "blondes",
  "blowjobs",
  "bondage",
  "booty",
  "creampie",
  "cunnilingus",
  "deepThroat",
  "doublePenetration",
  "extremeHardcore",
  "facials",
  "feet",
  "femaleDomina",
  "fetish",
  "footjob",
  "gangBang",
  "gay",
  "goldenShower",
  "gothic",
  "hairy",
  "handjob",
  "highHeels",
  "latexLeather",
  "latinas",
  "lesbian",
  "masturbation",
  "milfMature",
  "objectsInsert",
  "orgy",
  "outdoor",
  "piercings",
  "pov",
  "pussy",
  "redhead",
  "rimjobs",
  "rolePlay",
  "roughSex",
  "sexToys",
  "shower",
  "sm",
  "solo",
  "spanking",
  "squirting",
  "stockings",
  "stripping",
  "submissive",
  "tattos",
  "threesome",
  "tinyTitties",
  "topless",
];

export const TAGS: TagsType[] = tagList.map((currentTag) => {
  return { value: currentTag, label: currentTag };
});
