import { IoniconsName } from "@/src/utils/icons";
import { DayLog } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/src/utils/theme";

interface Props {
  logs: DayLog[];
  startDate: string | null;
  relapseCount: number;
}

type Status = "clean" | "ok" | "bad" | "fail" | "today" | "missed" | "future";

function dateForDay(startDate: string, dayNumber: number): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + dayNumber - 1);
  return d.toISOString().split("T")[0];
}

function computeCurrentDay(startDate: string | null): number {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const startDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const today = new Date();
  const todayDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const diffMs = todayDay.getTime() - startDay.getTime();
  const diff = Math.floor(diffMs / 86400000);
  return Math.min(Math.max(diff + 1, 1), 30);
}

export default function DayTracker({ logs, startDate, relapseCount }: Props) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const currentDay = computeCurrentDay(startDate);
  const todayStr = new Date().toISOString().split("T")[0];

  const getLogForDay = (day: number): DayLog | undefined => {
    if (!startDate) return undefined;
    const targetDate = dateForDay(startDate, day);
    return logs.find((l) => l.date.split("T")[0] === targetDate);
  };

  const getDayStatus = (day: number): Status => {
    const log = getLogForDay(day);
    if (day === currentDay)
      return log
        ? log.count === 0
          ? "clean"
          : log.count <= 2
            ? "ok"
            : log.count <= 5
              ? "bad"
              : "fail"
        : "today";
    if (day < currentDay) {
      if (!log) return "missed";
      if (log.count === 0) return "clean";
      if (log.count <= 2) return "ok";
      if (log.count <= 5) return "bad";
      return "fail";
    }
    return "future";
  };

  const getColor = (status: Status): string => {
    switch (status) {
      case "clean":
        return COLORS.success;
      case "ok":
        return COLORS.warning;
      case "bad":
        return COLORS.danger;
      case "fail":
        return COLORS.dangerDim;
      case "today":
        return COLORS.info;
      case "missed":
        return COLORS.textSecondary;
      default:
        return "#374151";
    }
  };

  const getIcon = (status: Status): { name: IoniconsName; size: number } => {
    switch (status) {
      case "clean":
        return { name: "checkmark", size: 12 };
      case "ok":
        return { name: "reorder-two-outline", size: 12 };
      case "bad":
        return { name: "arrow-down", size: 12 };
      case "fail":
        return { name: "close", size: 12 };
      case "today":
        return { name: "radio-button-on", size: 12 };
      case "missed":
        return { name: "help", size: 12 };
      default:
        return { name: "ellipse-outline", size: 10 };
    }
  };

  const milestoneIcons: Record<number, IoniconsName> = {
    5: "flame",
    10: "flash",
    15: "medal",
    20: "shield",
    25: "star",
    30: "trophy",
  };

  const legend: { color: string; label: string; icon: IoniconsName }[] = [
    { color: COLORS.success, label: "Zéro", icon: "checkmark" },
    { color: COLORS.warning, label: "1-2", icon: "reorder-two-outline" },
    { color: COLORS.danger, label: "3-5", icon: "arrow-down" },
    { color: COLORS.dangerDim, label: "6+", icon: "close" },
    { color: COLORS.info, label: "Auj'", icon: "radio-button-on" },
    { color: COLORS.textSecondary, label: "Manqué", icon: "help" },
  ];

  return (
    <View style={st.container}>
      <View style={st.headerRow}>
        <View style={st.titleRow}>
          <Ionicons name="calendar" size={14} color={COLORS.textSecondary} />
          <Text style={st.title}> Les 30 jours</Text>
        </View>
        <Text style={st.dayIndicator}>Jour {currentDay}/30</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={st.scroll}
      >
        {days.map((day) => {
          const status = getDayStatus(day);
          const color = getColor(status);
          const icon = getIcon(status);
          const milestoneIcon = milestoneIcons[day];
          const isToday = day === currentDay;

          return (
            <View key={day} style={st.dayWrap}>
              <View style={st.milestoneTop}>
                {milestoneIcon && (
                  <Ionicons name={milestoneIcon} size={10} color={color} />
                )}
              </View>
              <View
                style={[
                  st.dayCell,
                  { backgroundColor: color + "33", borderColor: color },
                  isToday && st.todayCell,
                ]}
              >
                <Ionicons name={icon.name} size={icon.size} color={color} />
              </View>
              <Text
                style={[st.dayNum, { color: isToday ? COLORS.info : "#666" }]}
              >
                {day}
              </Text>
              {isToday && relapseCount > 0 && (
                <View style={st.badge}>
                  <Text style={st.badgeText}>{relapseCount}<Ionicons name={"fitness"} size={10} color={COLORS.danger} /></Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={st.legend}>
        {legend.map((l) => (
          <View key={l.label} style={st.legendItem}>
            <Ionicons name={l.icon} size={16} color={l.color} />
            <Text style={st.legendLabel}>{l.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.bgSecondary,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { color: COLORS.textSecondary, fontWeight: "700", fontSize: 14 },
  dayIndicator: { color: COLORS.gold, fontWeight: "700", fontSize: 12 },
  scroll: { paddingBottom: 4, gap: 6 },
  dayWrap: { alignItems: "center", width: 32 },
  milestoneTop: {
    height: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  dayCell: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  todayCell: {
    shadowColor: COLORS.info,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  dayNum: { fontSize: 9, marginTop: 2, fontWeight: "600" },
  badge: {
    marginTop: 2,
    backgroundColor: COLORS.danger + "22",
    borderRadius: 6,
    paddingHorizontal: 3,
    paddingVertical: 1,
    alignItems: "center",
  },
  badgeText: { color: COLORS.danger, fontSize: 10, fontWeight: "900" },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
    justifyContent: "center",
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendLabel: { color: "#888", fontSize: 10 },
});
