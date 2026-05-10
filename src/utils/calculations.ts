import { DayLog } from "@/types";
import { COLORS } from "./theme";

const POINTS_PER_HOUR = 50;
const POINTS_PER_LEVEL = 200;
const MAX_LEVEL = 30;

function computeScoreDeltaCigarette(count: number): number {
  if (count === 0) return 200;
  if (count === 1) return 150;
  if (count === 2) return 100;
  if (count === 3) return 60;
  if (count === 4) return 30;
  if (count === 5) return 0;
  if (count === 6) return -30;
  if (count === 7) return -60;
  if (count === 8) return -90;
  if (count === 9) return -120;
  if (count === 10) return -150;
  if (count === 11) return -170;
  if (count === 12) return -190;
  if (count === 13) return -210;
  if (count === 14) return -230;
  if (count === 15) return -250;
  if (count === 16) return -290;
  if (count === 17) return -320;
  if (count === 18) return -350;
  if (count === 19) return -375;
  if (count === 20) return -400;
  return -400;
}

function computeScoreDeltaAlcohol(count: number): number {
  if (count === 0) return 200;
  if (count === 1) return 80;
  if (count === 2) return 20;
  if (count === 3) return -60;
  if (count === 4) return -120;
  if (count === 5) return -200;
  if (count <= 8) return -280;
  if (count <= 12) return -350;
  return -400;
}

function computeScoreDeltaSugar(count: number): number {
  if (count === 0) return 200;
  if (count === 1) return 100;
  if (count === 2) return 30;
  if (count === 3) return -40;
  if (count === 4) return -100;
  if (count === 5) return -180;
  if (count <= 8) return -250;
  return -350;
}

function computeScoreDeltaScreen(count: number): number {
  if (count === 0) return 200;
  if (count === 1) return 100;
  if (count === 2) return 20;
  if (count === 3) return -60;
  if (count === 4) return -130;
  if (count === 5) return -200;
  if (count <= 8) return -300;
  return -400;
}

function computeScoreDeltaGambling(count: number): number {
  if (count === 0) return 200;
  if (count === 1) return 0;
  if (count === 2) return -100;
  if (count === 3) return -200;
  if (count <= 5) return -300;
  return -400;
}

function computeScoreDeltaCoffee(count: number): number {
  if (count === 0) return 200;
  if (count === 1) return 120;
  if (count === 2) return 50;
  if (count === 3) return -20;
  if (count === 4) return -80;
  if (count === 5) return -150;
  if (count <= 8) return -250;
  return -350;
}

function computeScoreDeltaDefault(count: number): number {
  if (count === 0) return 200;
  if (count === 1) return 80;
  if (count === 2) return 0;
  if (count === 3) return -80;
  if (count <= 5) return -150;
  if (count <= 10) return -250;
  return -400;
}

export function computeScoreDelta(count: number, addictionId?: string): number {
  switch (addictionId) {
    case "cigarette": return computeScoreDeltaCigarette(count);
    case "alcohol":   return computeScoreDeltaAlcohol(count);
    case "sugar":     return computeScoreDeltaSugar(count);
    case "screen":    return computeScoreDeltaScreen(count);
    case "gambling":  return computeScoreDeltaGambling(count);
    case "coffee":    return computeScoreDeltaCoffee(count);
    default:          return computeScoreDeltaDefault(count);
  }
}

export function computeLevel(score: number): number {
  return Math.min(Math.floor(score / POINTS_PER_LEVEL), MAX_LEVEL);
}

export function computePointsToNextLevel(score: number): number {
  const currentLevel = computeLevel(score);
  if (currentLevel >= MAX_LEVEL) return 0;
  return (currentLevel + 1) * POINTS_PER_LEVEL - score;
}

export function computePosition(logs: DayLog[]): number {
  return 0;
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

export function getSecondsUntilNextTick(lastTickTime: string | null): number {
  if (!lastTickTime) return 3600;
  const elapsed = (Date.now() - new Date(lastTickTime).getTime()) / 1000;
  return Math.max(0, Math.ceil(3600 - elapsed));
}

export function getMinutesUntilNextTick(lastTickTime: string | null): number {
  return Math.ceil(getSecondsUntilNextTick(lastTickTime) / 60);
}

export function getDeltaInfo(
  count: number,
  addictionId?: string,
): {
  delta: number;
  text: string;
  icon: "arrow-up" | "arrow-forward" | "reorder-two-outline" | "arrow-down";
  color: string;
} {
  const delta = computeScoreDelta(count, addictionId);
  if (delta > 0)
    return { delta, text: `+${delta} pts`, icon: "arrow-up", color: COLORS.success };
  if (delta === 0)
    return { delta, text: `±0 pts`, icon: "arrow-forward", color: COLORS.warning };
  return { delta, text: `${delta} pts`, icon: "arrow-down", color: COLORS.danger };
}