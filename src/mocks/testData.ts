import { DayLog } from "@/types";
import { TROPHY_DEFS } from "@/src/store/useStore";

export const mockLogs: DayLog[] = [
  { day: 1, count: 0, date: "2026-05-01" },
  { day: 2, count: 1, date: "2026-05-02" },
  { day: 3, count: 3, date: "2026-05-03" },
  { day: 4, count: 0, date: "2026-05-04" },
  { day: 5, count: 7, date: "2026-05-05" },
  { day: 6, count: 2, date: "2026-05-06" },
  { day: 7, count: 0, date: "2026-05-07" },
];

export const mockUnlockedTrophies = TROPHY_DEFS.map((t) => t.id);

export const mockStats = {
  position: 7,
  streak: 3,

  logs: [
    { day: 1, count: 0, date: "2026-05-01" },
    { day: 2, count: 1, date: "2026-05-02" },
    { day: 3, count: 3, date: "2026-05-03" },
    { day: 4, count: 0, date: "2026-05-04" },
    { day: 5, count: 7, date: "2026-05-05" },
    { day: 6, count: 2, date: "2026-05-06" },
    { day: 7, count: 0, date: "2026-05-07" },
  ],
};