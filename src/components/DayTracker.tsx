import { IoniconsName } from "@/src/utils/icons";
import { DayLog } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/src/utils/theme";

interface Props {
  logs: DayLog[];
  currentDay: number;
  relapseCount: number;
}

type Status = "clean" | "ok" | "bad" | "fail" | "today" | "missed" | "future";

export default function DayTracker({ logs, currentDay, relapseCount }: Props) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const getDayStatus = (day: number): Status => {
    const log = logs.find((l) => l.day === day);
    if (!log)
      return day < currentDay
        ? "missed"
        : day === currentDay
          ? "today"
          : "future";
    if (log.count === 0) return "clean";
    if (log.count <= 2) return "ok";
    if (log.count <= 5) return "bad";
    return "fail";
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
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Ionicons name="calendar" size={14} color={COLORS.textSecondary} />
          <Text style={styles.title}> Les 30 jours</Text>
        </View>
        <Ionicons name="arrow-forward" size={16} color={COLORS.textSecondary} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {days.map((day) => {
          const status = getDayStatus(day);
          const color = getColor(status);
          const icon = getIcon(status);
          const milestoneIcon = milestoneIcons[day];
          const isToday = day === currentDay;

          return (
            <View key={day} style={styles.dayWrap}>
              <View style={styles.milestoneTop}>
                {milestoneIcon && (
                  <Ionicons name={milestoneIcon} size={10} color={color} />
                )}
              </View>

              <View
                style={[
                  styles.dayCell,
                  { backgroundColor: color + "33", borderColor: color },
                  isToday && styles.todayCell,
                ]}
              >
                <Ionicons name={icon.name} size={icon.size} color={color} />
              </View>

              <Text
                style={[
                  styles.dayNum,
                  { color: isToday ? COLORS.info : "#666" },
                ]}
              >
                {day}
              </Text>

              {isToday && relapseCount > 0 && (
                <View style={styles.relapseBadge}>
                  <Text style={styles.relapseBadgeText}><Ionicons name="fitness" size={9} color={COLORS.danger} /> {relapseCount}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.legend}>
        {legend.map((l) => (
          <View key={l.label} style={styles.legendItem}>
            <Ionicons name={l.icon} size={10} color={l.color} />
            <Text style={styles.legendLabel}>{l.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.bgSecondary,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  title: { color: COLORS.textSecondary, fontWeight: "700", fontSize: 14 },
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
  relapseBadge: {
    marginTop: 2,
    backgroundColor: COLORS.danger + "22",
    borderRadius: 6,
    paddingHorizontal: 2,
    paddingVertical: 1,
    alignItems: "center",
  },
  relapseBadgeText: { color: COLORS.danger, fontSize: 7, fontWeight: "900" },
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
