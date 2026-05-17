import { DayLog } from "@/types";
import { COLORS } from "./theme";

export const POINTS_PER_LEVEL = 200;
export const MAX_LEVEL = 30;

export function getTickIntervalSecondsFinal(level: number): number {
  if (level >= 30) return 4 * 3600;
  if (level >= 25) return 3.5 * 3600;
  if (level >= 20) return 3 * 3600;
  if (level >= 15) return 2.5 * 3600;
  if (level >= 10) return 2 * 3600;
  if (level >= 5) return 1.5 * 3600;
  return 1 * 3600;
}

export function computeTicksDue(
  lastTickTime: string,
  intervalSeconds: number,
): number {
  const from = new Date(lastTickTime).getTime();
  const now = Date.now();
  if (now <= from) return 0;

  const ACTIVE_START_H = 7;
  const ACTIVE_END_H = 23;
  let activeElapsedMs = 0;
  let cursor = from;

  while (cursor < now) {
    const cursorDate = new Date(cursor);
    const dayActiveStart = new Date(cursorDate);
    dayActiveStart.setHours(ACTIVE_START_H, 0, 0, 0);
    const dayActiveEnd = new Date(cursorDate);
    dayActiveEnd.setHours(ACTIVE_END_H, 0, 0, 0);

    const windowStart = Math.max(cursor, dayActiveStart.getTime());
    const windowEnd = Math.min(now, dayActiveEnd.getTime());
    if (windowEnd > windowStart) activeElapsedMs += windowEnd - windowStart;

    const nextDay = new Date(cursorDate);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(ACTIVE_START_H, 0, 0, 0);
    cursor = nextDay.getTime();
  }

  return Math.floor(activeElapsedMs / 1000 / intervalSeconds);
}

export function getSecondsUntilNextTick(
  lastTickTime: string | null,
  level = 0,
): number {
  if (!lastTickTime) return getTickIntervalSecondsFinal(level);
  const interval = getTickIntervalSecondsFinal(level);
  const elapsed = (Date.now() - new Date(lastTickTime).getTime()) / 1000;
  return Math.max(0, Math.ceil(interval - elapsed));
}

function penaltyMult(level: number): number {
  if (level >= 30) return 5;
  if (level >= 25) return 4;
  if (level >= 20) return 3;
  if (level >= 15) return 2;
  if (level >= 10) return 1;
  return 0;
}

export function computeScoreDelta(
  count: number,
  _?: string,
  level = 0,
): number {
  if (count === 0) return 200;
  if (count === 1) return 150;
  if (count === 2) return 100;

  if (count <= 12) {
    const baseAt12 = level < 5 ? 50 : level < 10 ? 0 : -50 * penaltyMult(level);
    return baseAt12 + (12 - count) * 10;
  }

  const mult = penaltyMult(level);
  if (mult === 0) return 0;
  return Math.max(-400, -50 * mult * Math.ceil((count - 12) / 2));
}

export function computeLevel(score: number): number {
  return Math.min(Math.floor(score / POINTS_PER_LEVEL), MAX_LEVEL);
}

export function computePointsToNextLevel(score: number): number {
  const l = computeLevel(score);
  if (l >= MAX_LEVEL) return 0;
  return (l + 1) * POINTS_PER_LEVEL - score;
}

export function computeStreak(logs: DayLog[]): number {
  let streak = 0;
  for (const log of [...logs].sort((a, b) => b.day - a.day)) {
    if (log.count === 0) streak++;
    else break;
  }
  return streak;
}

export function computeDayNumber(startDate: string | null): number {
  if (!startDate) return 1;
  const diff = Math.floor(
    (Date.now() - new Date(startDate).getTime()) / 86400000,
  );
  return Math.min(diff + 1, 30);
}

export function getDeltaInfo(count: number, _?: string, level = 0) {
  const delta = computeScoreDelta(count, undefined, level);
  if (delta > 0)
    return {
      delta,
      text: `+${delta} pts`,
      icon: "arrow-up" as const,
      color: COLORS.success,
    };
  if (delta === 0)
    return {
      delta,
      text: `±0 pts`,
      icon: "arrow-forward" as const,
      color: COLORS.warning,
    };
  return {
    delta,
    text: `${delta} pts`,
    icon: "arrow-down" as const,
    color: COLORS.danger,
  };
}