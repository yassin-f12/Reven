import { IoniconsName } from "@/src/utils/icons";
import { ImageSourcePropType } from "react-native";
export interface Avatar {
  id: string;
  image: ImageSourcePropType;
  label: string;
}
export interface Addiction {
  id: string;
  label: string;
  iconName: IoniconsName;
  unit: string;
}
export interface User {
  pseudo: string;
  avatar: Avatar;
  addiction: Addiction;
}
export interface DayLog {
  day: number;
  count: number;
  date: string; 
}
export interface Trophy {
  id: string;
  iconName: IoniconsName;
  title: string;
  desc: string;
  unlocked?: boolean;
}
export interface NotificationSettings {
  enabled: boolean;
  hour: number;   
  minute: number; 
}
export interface AppState {
  user: User | null;
  logs: DayLog[];
  position: number;
  score: number;
  lastTickTime: string | null;
  streak: number;
  unlockedTrophies: string[];
  startDate: string | null;
  newTrophy: Trophy | null;
  todayLog: DayLog | null;
  dayNumber: number;
  notificationSettings: NotificationSettings;
  scoreBeforeTodayLog: number | null; 
  relapseCount: number;             
}