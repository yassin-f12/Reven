import { IoniconsName } from "@/src/utils/icons";
import { DayLog } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface Props {
  logs: DayLog[];
  currentDay: number;
}

type Status = "clean" | "ok" | "bad" | "fail" | "today" | "missed" | "future";

export default function DayTracker({ logs, currentDay }: Props) {
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
        return "#4ade80";
      case "ok":
        return "#facc15";
      case "bad":
        return "#fb923c";
      case "fail":
        return "#f87171";
      case "today":
        return "#60a5fa";
      case "missed":
        return "#6b7280";
      default:
        return "#374151";
    }
  };

  const getIcon = (
    status: Status,
  ): {
    name: IoniconsName;
    size: number;
  } => {
    switch (status) {
      case "clean":
        return { name: "checkmark", size: 12 };
      case "ok":
        return { name: "remove", size: 12 };
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

  const milestoneIcons: Record<
    number,
    IoniconsName
  > = {
    7: "flame",
    15: "flash",
    30: "trophy",
  };

  const legend: {
    color: string;
    label: string;
    icon: IoniconsName;
  }[] = [
    { color: "#4ade80", label: "Zéro", icon: "checkmark" },
    { color: "#facc15", label: "1-2", icon: "remove" },
    { color: "#fb923c", label: "3-5", icon: "arrow-down" },
    { color: "#f87171", label: "6+", icon: "close" },
    { color: "#60a5fa", label: "Auj'", icon: "radio-button-on" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Ionicons name="calendar" size={14} color="#fff" />
        <Text style={styles.title}> Les 30 jours</Text>
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
          return (
            <View key={day} style={styles.dayWrap}>
              {milestoneIcon && (
                <Ionicons
                  name={milestoneIcon}
                  size={10}
                  color={color}
                  style={{ marginBottom: 2 }}
                />
              )}
              <View
                style={[
                  styles.dayCell,
                  { backgroundColor: color + "33", borderColor: color },
                  status === "today" && styles.todayCell,
                ]}
              >
                <Ionicons name={icon.name} size={icon.size} color={color} />
              </View>
              <Text
                style={[
                  styles.dayNum,
                  { color: status === "today" ? "#60a5fa" : "#666" },
                ]}
              >
                {day}
              </Text>
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
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { color: "#fff", fontWeight: "700", fontSize: 14 },
  scroll: { paddingBottom: 4, gap: 6 },
  dayWrap: { alignItems: "center", width: 32 },
  dayCell: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  todayCell: {
    shadowColor: "#60a5fa",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  dayNum: { fontSize: 9, marginTop: 2, fontWeight: "600" },
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
