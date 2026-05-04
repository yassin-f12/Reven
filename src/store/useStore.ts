import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { AppState, DayLog, NotificationSettings, Trophy, User } from '@/types';
import { computeDayNumber, computePosition, computeStreak } from '@/src/utils/calculations';

const STORAGE_KEY = 'reven_data';

export const TROPHY_DEFS: Trophy[] = [
  { id: 't1', iconName: 'leaf',           title: 'Premier Pas',   desc: 'Premier jour sans rechute' },
  { id: 't2', iconName: 'flame',          title: 'En Feu',        desc: '3 jours consécutifs clean' },
  { id: 't3', iconName: 'flash',          title: 'Une Semaine !', desc: '7 jours sans craquer' },
  { id: 't4', iconName: 'water',          title: 'Mi-Parcours',   desc: '15 jours atteints' },
  { id: 't5', iconName: 'triangle',       title: 'Presque là...', desc: '25 jours de courage' },
  { id: 't6', iconName: 'trophy',          title: 'Le Sommet',     desc: '30 jours — Tu as réussi !' },
  { id: 't7', iconName: 'radio-button-on',title: 'Jour Zéro',     desc: 'Une journée sans aucune' },
  { id: 't8', iconName: 'barbell',        title: 'Résistance',    desc: '5 jours zéro conso' },
];

function computeTrophies(logs: DayLog[], streak: number): string[] {
  return TROPHY_DEFS.filter(t => {
    if (t.id === 't1') return streak >= 1;
    if (t.id === 't2') return streak >= 3;
    if (t.id === 't3') return streak >= 7;
    if (t.id === 't4') return streak >= 15;
    if (t.id === 't5') return streak >= 25;
    if (t.id === 't6') return streak >= 30;
    if (t.id === 't7') return logs.some(l => l.count === 0);
    if (t.id === 't8') return logs.filter(l => l.count === 0).length >= 5;
    return false;
  }).map(t => t.id);
}

interface Store extends AppState {
  setUser: (user: User) => Promise<void>;
  logDay: (count: number) => Promise<void>;
  clearNewTrophy: () => void;
  hydrate: () => Promise<void>;
  reset: () => Promise<void>;
  updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
}

const useStore = create<Store>((set, get) => ({
  user: null,
  logs: [],
  position: 0,
  streak: 0,
  unlockedTrophies: [],
  startDate: null,
  newTrophy: null,
  todayLog: null,
  dayNumber: 1,
  notificationSettings: { enabled: false, hour: 20, minute: 0 },

  setUser: async (user) => {
    const startDate = new Date().toISOString();
    set({ user, startDate, dayNumber: 1 });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user, logs: [], startDate, notificationSettings: { enabled: false, hour: 20, minute: 0 } }));
  },

  logDay: async (count) => {
    const state = get();
    const today = new Date().toDateString();
    const alreadyLogged = state.logs.find(l => new Date(l.date).toDateString() === today);

    let newLogs: DayLog[];
    if (alreadyLogged) {
      newLogs = state.logs.map(l =>
        new Date(l.date).toDateString() === today ? { ...l, count } : l
      );
    } else {
      newLogs = [...state.logs, { day: state.logs.length + 1, count, date: new Date().toISOString() }];
    }

    const position = computePosition(newLogs);
    const streak = computeStreak(newLogs);
    const unlockedTrophies = computeTrophies(newLogs, streak);
    const newlyUnlocked = unlockedTrophies.find(id => !state.unlockedTrophies.includes(id));
    const newTrophy = newlyUnlocked ? TROPHY_DEFS.find(t => t.id === newlyUnlocked) ?? null : null;
    const todayLog = newLogs.find(l => new Date(l.date).toDateString() === today) ?? null;

    set({ logs: newLogs, position, streak, unlockedTrophies, newTrophy, todayLog });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: state.user, logs: newLogs, startDate: state.startDate,
      notificationSettings: state.notificationSettings,
    }));
  },

  clearNewTrophy: () => set({ newTrophy: null }),

  updateNotificationSettings: async (settings) => {
    set({ notificationSettings: settings });
    const state = get();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: state.user, logs: state.logs, startDate: state.startDate,
      notificationSettings: settings,
    }));
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { user, logs, startDate, notificationSettings } = JSON.parse(raw);
        const safeLogs: DayLog[] = logs || [];
        const position = computePosition(safeLogs);
        const streak = computeStreak(safeLogs);
        const unlockedTrophies = computeTrophies(safeLogs, streak);
        const today = new Date().toDateString();
        const todayLog = safeLogs.find(l => new Date(l.date).toDateString() === today) ?? null;
        const dayNumber = computeDayNumber(startDate);
        set({
          user, logs: safeLogs, startDate, position, streak,
          unlockedTrophies, todayLog, dayNumber,
          notificationSettings: notificationSettings || { enabled: false, hour: 20, minute: 0 },
        });
      }
    } catch (e) {
      console.error('Hydrate error', e);
    }
  },

  reset: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ user: null, logs: [], position: 0, streak: 0, unlockedTrophies: [], startDate: null, todayLog: null, dayNumber: 1, newTrophy: null });
  },
}));

export default useStore;