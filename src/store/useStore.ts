import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { AppState, DayLog, NotificationSettings, Trophy, User } from "@/types";
import {
  computeDayNumber,
  computeLevel,
  computeScoreDelta,
  computeStreak,
  getTickIntervalSecondsFinal,
  computeTicksDue,
} from "@/src/utils/calculations";

const STORAGE_KEY = "reven_data";
const POINTS_PER_TICK = 50;

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
    desc: "3 jours loggés consécutifs",
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
    iconName: "medal",
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

function computeTrophies(
  logs: DayLog[],
  streak: number,
  level: number,
): string[] {
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

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

async function persist(s: Store): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: s.user,
        logs: s.logs,
        startDate: s.startDate,
        score: s.score,
        lastTickTime: s.lastTickTime,
        scoreBeforeTodayLog: s.scoreBeforeTodayLog,
        relapseCount: s.relapseCount,
        relapseCountDate: s.relapseCountDate,
        dailyCount: s.dailyCount,
        dailyCountDate: s.dailyCountDate,
        animationsSeenForLevels: s.animationsSeenForLevels,
      }),
    );
  } catch (e) {
    console.error("Persist error", e);
  }
}

interface ExtendedAppState extends AppState {
  dailyCount: number;
  dailyCountDate: string;
  relapseCount: number;
  relapseCountDate: string;
  animationsSeenForLevels: number[];
  trophyQueue: Trophy[];
}

interface Store extends ExtendedAppState {
  setUser: (user: User) => Promise<void>;
  logDay: (count: number) => Promise<void>;
  reportRelapse: () => Promise<void>;
  decrementDailyCount: () => Promise<void>;
  tickHourly: () => Promise<void>;
  clearNewTrophy: () => void;
  hydrate: () => Promise<void>;
  reset: () => Promise<void>;
  setDailyCount: (count: number) => Promise<void>;
  markLevelAnimationSeen: (level: number) => Promise<void>;
  checkMidnightResets: () => Promise<void>;
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
  trophyQueue: [],
  todayLog: null,
  dayNumber: 1,
  notificationSettings: { enabled: false, hour: 20, minute: 0 },
  scoreBeforeTodayLog: null,
  relapseCount: 0,
  relapseCountDate: todayKey(),
  dailyCount: 0,
  dailyCountDate: todayKey(),
  animationsSeenForLevels: [],

  checkMidnightResets: async () => {
    const state = get();
    const today = todayKey();
    const updates: Partial<ExtendedAppState> = {};
    if ((state.relapseCountDate || today) !== today) {
      updates.relapseCount = 0;
      updates.relapseCountDate = today;
    }
    if ((state.dailyCountDate || today) !== today) {
      updates.dailyCount = 0;
      updates.dailyCountDate = today;
    }
    if (Object.keys(updates).length === 0) return;
    set(updates as any);
    await persist(get());
  },

  tickHourly: async () => {
    const state = get();
    if (!state.lastTickTime) return;

    await state.checkMidnightResets();

    const interval = getTickIntervalSecondsFinal(state.position);
    const ticksDue = computeTicksDue(state.lastTickTime, interval);
    if (ticksDue <= 0) return;

    const newScore = Math.max(0, state.score + ticksDue * POINTS_PER_TICK);
    const level = computeLevel(newScore);
    const unlockedTrophies = computeTrophies(state.logs, state.streak, level);

    const newlyUnlocked = unlockedTrophies.filter(
      (id) => !state.unlockedTrophies.includes(id),
    );
    const newTrophyObjects = newlyUnlocked
      .map((id) => TROPHY_DEFS.find((t) => t.id === id))
      .filter(Boolean) as Trophy[];

    const combined = [...state.trophyQueue, ...newTrophyObjects];
    let nextTrophy: Trophy | null = state.newTrophy;
    let remainingQueue: Trophy[];
    if (!nextTrophy && combined.length > 0) {
      nextTrophy = combined[0];
      remainingQueue = combined.slice(1);
    } else {
      remainingQueue = combined;
    }

    const prevMs = new Date(state.lastTickTime).getTime();
    const lastTickTime = new Date(
      prevMs + ticksDue * interval * 1000,
    ).toISOString();

    set({
      score: newScore,
      position: level,
      lastTickTime,
      unlockedTrophies,
      newTrophy: nextTrophy,
      trophyQueue: remainingQueue,
    });
    await persist(get());
  },

  setUser: async (user) => {
    const now = new Date().toISOString();
    const today = todayKey();
    set({
      user,
      startDate: now,
      dayNumber: 1,
      score: 0,
      lastTickTime: now,
      position: 0,
      relapseCount: 0,
      relapseCountDate: today,
      dailyCount: 0,
      dailyCountDate: today,
      animationsSeenForLevels: [],
      logs: [],
      unlockedTrophies: [],
      streak: 0,
      newTrophy: null,
      trophyQueue: [],
      todayLog: null,
      scoreBeforeTodayLog: null,
    });
    await persist(get());
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

    const delta = computeScoreDelta(count, undefined, state.position);
    const newScore = Math.max(0, baseScore + delta);
    const streak = computeStreak(newLogs);
    const level = computeLevel(newScore);
    const unlockedTrophies = computeTrophies(newLogs, streak, level);

    const newlyUnlocked = unlockedTrophies.filter(
      (id) => !state.unlockedTrophies.includes(id),
    );
    const newTrophyObjects = newlyUnlocked
      .map((id) => TROPHY_DEFS.find((t) => t.id === id))
      .filter(Boolean) as Trophy[];

    const combined = [...state.trophyQueue, ...newTrophyObjects];
    let nextTrophy: Trophy | null = state.newTrophy;
    let remainingQueue: Trophy[];
    if (!nextTrophy && combined.length > 0) {
      nextTrophy = combined[0];
      remainingQueue = combined.slice(1);
    } else {
      remainingQueue = combined;
    }

    const todayLog =
      newLogs.find((l) => new Date(l.date).toDateString() === today) ?? null;
    const scoreBeforeTodayLog = alreadyLogged
      ? state.scoreBeforeTodayLog
      : baseScore;

    set({
      logs: newLogs,
      score: newScore,
      position: level,
      streak,
      unlockedTrophies,
      newTrophy: nextTrophy,
      trophyQueue: remainingQueue,
      todayLog,
      scoreBeforeTodayLog,
    });
    await persist(get());
  },

  reportRelapse: async () => {
    const state = get();
    const relapseCount = (state.relapseCount ?? 0) + 1;
    const lastTickTime = new Date().toISOString();
    set({ relapseCount, lastTickTime });
    await persist(get());
  },

  decrementDailyCount: async () => {
    const state = get();
    if (state.dailyCount <= 0) return;
    set({ dailyCount: state.dailyCount - 1 });
    await persist(get());
  },

  setDailyCount: async (count) => {
    const today = todayKey();
    set({ dailyCount: count, dailyCountDate: today });
    await persist(get());
  },

  markLevelAnimationSeen: async (level) => {
    const state = get();
    if (state.animationsSeenForLevels.includes(level)) return;
    set({ animationsSeenForLevels: [...state.animationsSeenForLevels, level] });
    await persist(get());
  },

  clearNewTrophy: () => {
    const state = get();
    const [next, ...rest] = state.trophyQueue;
    set({ newTrophy: next ?? null, trophyQueue: rest ?? [] });
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw);
      const today = todayKey();
      const safeLogs = p.logs || [];
      const safeScore = p.score || 0;
      const streak = computeStreak(safeLogs);
      const level = computeLevel(safeScore);
      const todayDateStr = new Date().toDateString();
      set({
        user: p.user ?? null,
        logs: safeLogs,
        startDate: p.startDate ?? null,
        score: safeScore,
        lastTickTime: p.lastTickTime ?? null,
        position: level,
        streak,
        unlockedTrophies: computeTrophies(safeLogs, streak, level),
        todayLog:
          safeLogs.find(
            (l: DayLog) => new Date(l.date).toDateString() === todayDateStr,
          ) ?? null,
        dayNumber: computeDayNumber(p.startDate),
        scoreBeforeTodayLog: p.scoreBeforeTodayLog ?? null,
        relapseCount: p.relapseCount ?? 0,
        relapseCountDate: p.relapseCountDate ?? today,
        dailyCount: p.dailyCount ?? 0,
        dailyCountDate: p.dailyCountDate ?? today,
        animationsSeenForLevels: p.animationsSeenForLevels ?? [],
        newTrophy: null,
        trophyQueue: [],
      });
      await get().checkMidnightResets();
    } catch (e) {
      console.error("Hydrate error", e);
    }
  },

  reset: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    const today = todayKey();
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
      trophyQueue: [],
      scoreBeforeTodayLog: null,
      relapseCount: 0,
      relapseCountDate: today,
      dailyCount: 0,
      dailyCountDate: today,
      animationsSeenForLevels: [],
    });
  },
}));

export default useStore;
