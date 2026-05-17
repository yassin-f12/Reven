import { Addiction, Avatar } from "@/types";

export const AVATARS: Avatar[] = [
  {
    id: "a1",
    image: require("@/assets/images/avatars/Grimpeur.png"),
    label: "Grimpeur(se)",
  },
  {
    id: "a2",
    image: require("@/assets/images/avatars/Heros.png"),
    label: "Héros(ïne)",
  },
  {
    id: "a3",
    image: require("@/assets/images/avatars/Sage.png"),
    label: "Sage",
  },
  {
    id: "a4",
    image: require("@/assets/images/avatars/Guerrier.png"),
    label: "Guerrier(ère)",
  },
  {
    id: "a5",
    image: require("@/assets/images/avatars/Loup.png"),
    label: "Loup",
  },
  {
    id: "a6",
    image: require("@/assets/images/avatars/Lion.png"),
    label: "Lion",
  },
  {
    id: "a7",
    image: require("@/assets/images/avatars/Dragon.png"),
    label: "Dragon",
  },
  {
    id: "a8",
    image: require("@/assets/images/avatars/Phenix.png"),
    label: "Phénix",
  },
  {
    id: "a9",
    image: require("@/assets/images/avatars/Licorne.png"),
    label: "Licorne",
  },
];

export const ADDICTIONS: Addiction[] = [
  {
    id: "cigarette",
    label: "Cigarettes",
    iconName: "logo-no-smoking",
    unit: "cigarette(s)",
  },
];
