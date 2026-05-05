import { DayLog } from "@/types";
import { COLORS } from "./theme";

export function computePosition(logs: DayLog[]): number {
  let pos = 0;
  for (const log of logs) {
    const c = log.count;
    if (c === 0) pos += 3;
    else if (c <= 2) pos += 0;
    else if (c <= 5) pos -= 1;
    else if (c <= 10) pos -= 3;
    else pos -= 5;
  }
  return Math.max(0, Math.min(30, pos));
}

export function computeStreak(logs: DayLog[]): number {
  let streak = 0;
  const sorted = [...logs].sort((a, b) => b.day - a.day);
  for (const log of sorted) {
    if (log.count === 0) streak++;
    else break;
  }
  return streak;
}

export function computeDayNumber(startDate: string | null): number {
  if (!startDate) return 1;
  const diff = Math.floor(
    (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.min(diff + 1, 30);
}

export function getDeltaInfo(count: number): {
  delta: number;
  text: string;
  icon: "arrow-up" | "arrow-forward" | "reorder-two-outline" | "arrow-down";
  color: string;
} {
  if (count === 0)
    return { delta: 3, text: "+3 cases", icon: "arrow-up", color: COLORS.success };

  if (count <= 2)
    return { delta: 0, text: "stable", icon: "reorder-two-outline", color: COLORS.warning };

  if (count <= 5)
    return { delta: -1, text: "-1 case", icon: "arrow-down", color: COLORS.orange };

  if (count <= 10)
    return { delta: -3, text: "-3 cases", icon: "arrow-down", color: COLORS.danger };

  return { delta: -5, text: "-5 cases", icon: "arrow-down", color: COLORS.dangerDim };
}
