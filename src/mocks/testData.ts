import { DayLog } from "@/types";
import { TROPHY_DEFS } from "@/src/store/useStore";

const position =30; 
const score = 6000; 
const streak = 20; 
const relapseCount = 10; 
const dailyCount = 7; 
const trophies = ["t1", "t2", "t3", "t4"]; 

const logs: DayLog[] = [
  { day: 1, count: 0, date: "2026-05-11" },
  { day: 2, count: 3, date: "2026-05-12" },
  { day: 3, count: 0, date: "2026-05-13" },
  { day: 4, count: 7, date: "2026-05-14" },
  { day: 5, count: 1, date: "2026-05-15" },
  { day: 6, count: 0, date: "2026-05-16" },
  { day: 7, count: 2, date: "2026-05-17" },
  { day: 8, count: 0, date: "2026-05-18" },
  { day: 9, count: 5, date: "2026-05-19" },
  { day: 10, count: 0, date: "2026-05-20" },
];


const today = new Date().toISOString().split("T")[0];

export const mockData = {
  position,
  score,
  streak,
  relapseCount,
  relapseCountDate: today,
  dailyCount,
  dailyCountDate: today,
  logs,
  todayLog: logs.find((l) => l.date === today) ?? null,
  dayNumber: logs.length,
  startDate: logs[0]?.date
    ? new Date(logs[0].date).toISOString()
    : new Date().toISOString(),
  lastTickTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  scoreBeforeTodayLog: null,
  unlockedTrophies:
    (trophies as string | string[]) === "all"
      ? TROPHY_DEFS.map((t) => t.id)
      : (trophies as string[]),
  newTrophy: null,
  trophyQueue: [],
  animationsSeenForLevels: [],
};
