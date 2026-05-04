import { Addiction, Avatar } from "@/types";

export const AVATARS: Avatar[] = [
  { id: "a1", iconName: "walk", label: "Grimpeur" },
  { id: "a2", iconName: "shield", label: "Héros" },
  { id: "a3", iconName: "glasses", label: "Sage" },
  { id: "a4", iconName: "paw", label: "Renard" },
  { id: "a5", iconName: "moon", label: "Loup" },
  { id: "a6", iconName: "sunny", label: "Lion" },
  { id: "a7", iconName: "flame", label: "Dragon" },
  { id: "a8", iconName: "rocket", label: "Fusée" },
  { id: "a9", iconName: "flash", label: "Éclair" },
  { id: "a10", iconName: "star", label: "Étoile" },
  { id: "a11", iconName: "bonfire", label: "Feu" },
  { id: "a12", iconName: "diamond", label: "Diamant" },
];

export const ADDICTIONS: Addiction[] = [
  {
    id: "cigarette",
    label: "Cigarettes",
    iconName: "ban",
    unit: "cigarette(s)",
  },
  { id: "alcohol", label: "Alcool", iconName: "wine", unit: "verre(s)" },
  {
    id: "sugar",
    label: "Sucre / Junk food",
    iconName: "fast-food",
    unit: "écart(s)",
  },
  {
    id: "screen",
    label: "Temps d'écran",
    iconName: "phone-portrait",
    unit: "heure(s) en trop",
  },
  {
    id: "gambling",
    label: "Jeux / Paris",
    iconName: "dice",
    unit: "session(s)",
  },
  { id: "coffee", label: "Caféine", iconName: "cafe", unit: "café(s) en trop" },
  { id: "other", label: "Autre", iconName: "help-circle", unit: "fois" },
];
