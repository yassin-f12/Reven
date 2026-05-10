import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { AppState, DayLog, NotificationSettings, Trophy, User } from "@/types";
import {
  computeDayNumber,
  computeLevel,
  computeScoreDelta,
  computeStreak,
} from "@/src/utils/calculations";

const STORAGE_KEY = "reven_data";
const POINTS_PER_HOUR = 50;

export const TROPHY_DEFS: Trophy[] = [
  {
    id: "t1",
    iconName: "leaf",
    title: "Premier Pas",
    desc: "Atteindre le niveau 1",
  },
  {
    id: "t2",
    iconName: "flame",
    title: "En Feu",
    desc: "3 jours consécutifs clean",
  },
  {
    id: "t3",
    iconName: "flash",
    title: "Niveau 5",
    desc: "Atteindre le niveau 5",
  },
  {
    id: "t4",
    iconName: "water",
    title: "Niveau 10",
    desc: "Atteindre le niveau 10",
  },
  {
    id: "t5",
    iconName: "triangle",
    title: "Niveau 15",
    desc: "Atteindre le niveau 15",
  },
  {
    id: "t6",
    iconName: "shield",
    title: "Niveau 20",
    desc: "Atteindre le niveau 20",
  },
  {
    id: "t7",
    iconName: "star",
    title: "Niveau 25",
    desc: "Atteindre le niveau 25",
  },
  {
    id: "t8",
    iconName: "trophy",
    title: "Le Sommet",
    desc: "Niveau 30 - Tu as réussi !",
  },
  {
    id: "t9",
    iconName: "radio-button-on",
    title: "Jour Zéro",
    desc: "Une journée sans aucune",
  },
  {
    id: "t10",
    iconName: "barbell",
    title: "Résistance",
    desc: "5 jours zéro conso",
  },
];

function computeTrophies(logs: DayLog[], streak: number, level: number): string[] {
  return TROPHY_DEFS.filter((t) => {
    if (t.id === "t1") return level >= 1;
    if (t.id === "t2") return streak >= 3;
    if (t.id === "t3") return level >= 5;
    if (t.id === "t4") return level >= 10;
    if (t.id === "t5") return level >= 15;
    if (t.id === "t6") return level >= 20;
    if (t.id === "t7") return level >= 25;
    if (t.id === "t8") return level >= 30;
    if (t.id === "t9") return logs.some((l) => l.count === 0);
    if (t.id === "t10") return logs.filter((l) => l.count === 0).length >= 5;
    return false;
  }).map((t) => t.id);
}
interface Store extends AppState {
  setUser: (user: User) => Promise<void>;
  logDay: (count: number) => Promise<void>;
  reportRelapse: () => Promise<void>;
  tickHourly: () => Promise<void>;
  clearNewTrophy: () => void;
  hydrate: () => Promise<void>;
  reset: () => Promise<void>;
  updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
}

const useStore = create<Store>((set, get) => ({
  user: null,
  logs: [],
  position: 0,
  score: 0,
  lastTickTime: null,
  streak: 0,
  unlockedTrophies: [],
  startDate: null,
  newTrophy: null,
  todayLog: null,
  dayNumber: 1,
  notificationSettings: { enabled: false, hour: 20, minute: 0 },
  scoreBeforeTodayLog: null,
  relapseCount: 0,

  setUser: async (user) => {
    const startDate = new Date().toISOString();
    const lastTickTime = new Date().toISOString();
    set({ user, startDate, dayNumber: 1, score: 0, lastTickTime, position: 0 });
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user,
        logs: [],
        startDate,
        score: 0,
        lastTickTime,
        notificationSettings: { enabled: false, hour: 20, minute: 0 },
      }),
    );
  },

  tickHourly: async () => {
    const state = get();
    if (!state.lastTickTime) return;
    const elapsed =
      (Date.now() - new Date(state.lastTickTime).getTime()) / 1000 / 60;
    if (elapsed < 60) return;

    const newScore = Math.max(0, state.score + POINTS_PER_HOUR);
    const level = computeLevel(newScore);
    const unlockedTrophies = computeTrophies(state.logs, state.streak, level);
    const newlyUnlocked = unlockedTrophies.find(
      (id) => !state.unlockedTrophies.includes(id),
    );
    const newTrophy = newlyUnlocked
      ? (TROPHY_DEFS.find((t) => t.id === newlyUnlocked) ?? null)
      : null;
    const lastTickTime = new Date().toISOString();

    set({
      score: newScore,
      position: level,
      lastTickTime,
      unlockedTrophies,
      newTrophy,
    });
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        logs: state.logs,
        startDate: state.startDate,
        score: newScore,
        lastTickTime,
        notificationSettings: state.notificationSettings,
      }),
    );
  },

  logDay: async (count) => {
    const state = get();
    const today = new Date().toDateString();
    const alreadyLogged = state.logs.find(
      (l) => new Date(l.date).toDateString() === today,
    );

    let newLogs: DayLog[];
    let baseScore: number;

    if (alreadyLogged) {
      baseScore = state.scoreBeforeTodayLog ?? state.score;

      newLogs = state.logs.map((l) =>
        new Date(l.date).toDateString() === today ? { ...l, count } : l,
      );
    } else {
      baseScore = state.score;
      newLogs = [
        ...state.logs,
        { day: state.logs.length + 1, count, date: new Date().toISOString() },
      ];
    }

    const delta = computeScoreDelta(count, state.user?.addiction?.id);
    const newScore = Math.max(0, baseScore + delta);
    const streak = computeStreak(newLogs);
    const level = computeLevel(newScore);

    const unlockedTrophies = computeTrophies(newLogs, streak, level);
    const newlyUnlocked = unlockedTrophies.find(
      (id) => !state.unlockedTrophies.includes(id),
    );
    const newTrophy = newlyUnlocked
      ? (TROPHY_DEFS.find((t) => t.id === newlyUnlocked) ?? null)
      : null;
    const todayLog =
      newLogs.find((l) => new Date(l.date).toDateString() === today) ?? null;

    set({
      logs: newLogs,
      score: newScore,
      position: level,
      streak,
      unlockedTrophies,
      newTrophy,
      todayLog,
      lastTickTime: state.lastTickTime,
      scoreBeforeTodayLog: alreadyLogged
        ? state.scoreBeforeTodayLog
        : baseScore,
    });

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        logs: newLogs,
        startDate: state.startDate,
        score: newScore,
        lastTickTime: state.lastTickTime,
        notificationSettings: state.notificationSettings,
        scoreBeforeTodayLog: alreadyLogged
          ? state.scoreBeforeTodayLog
          : baseScore,
        relapseCount: state.relapseCount,
      }),
    );
  },

  reportRelapse: async () => {
    const state = get();
    const lastTickTime = new Date().toISOString();
    const relapseCount = (state.relapseCount ?? 0) + 1;
    set({ lastTickTime, relapseCount });
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        logs: state.logs,
        startDate: state.startDate,
        score: state.score,
        lastTickTime,
        notificationSettings: state.notificationSettings,
        scoreBeforeTodayLog: state.scoreBeforeTodayLog,
        relapseCount,
      }),
    );
  },

  clearNewTrophy: () => set({ newTrophy: null }),

  updateNotificationSettings: async (settings) => {
    set({ notificationSettings: settings });
    const state = get();
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        logs: state.logs,
        startDate: state.startDate,
        score: state.score,
        lastTickTime: state.lastTickTime,
        notificationSettings: settings,
      }),
    );
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const {
          user,
          logs,
          startDate,
          score,
          lastTickTime,
          notificationSettings,
          scoreBeforeTodayLog,
          relapseCount,
        } = parsed;
        const safeLogs: DayLog[] = logs || [];
        const safeScore: number = score || 0;
        const streak = computeStreak(safeLogs);
        const level = computeLevel(safeScore);
        const unlockedTrophies = computeTrophies(safeLogs, streak, level);
        const today = new Date().toDateString();
        const todayLog =
          safeLogs.find((l) => new Date(l.date).toDateString() === today) ??
          null;
        const dayNumber = computeDayNumber(startDate);
        set({
          user,
          logs: safeLogs,
          startDate,
          score: safeScore,
          lastTickTime: lastTickTime || null,
          position: level,
          streak,
          unlockedTrophies,
          todayLog,
          dayNumber,
          notificationSettings: notificationSettings || {
            enabled: false,
            hour: 20,
            minute: 0,
          },
          scoreBeforeTodayLog: scoreBeforeTodayLog ?? null,
          relapseCount: relapseCount ?? 0,
        });
      }
    } catch (e) {
      console.error("Hydrate error", e);
    }
  },

  reset: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({
      user: null,
      logs: [],
      position: 0,
      score: 0,
      lastTickTime: null,
      streak: 0,
      unlockedTrophies: [],
      startDate: null,
      todayLog: null,
      dayNumber: 1,
      newTrophy: null,
      scoreBeforeTodayLog: null,
      relapseCount: 0,
    });
  },
}));

export default useStore;
