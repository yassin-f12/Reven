import useStore from "@/src/store/useStore";
import { IoniconsName } from "@/src/utils/icons";
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@/src/utils/theme";
import { DayLog } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function StatsScreen() {
  const user = useStore((s) => s.user);
  const logs = useStore((s) => s.logs);
  const position = useStore((s) => s.position);
  const streak = useStore((s) => s.streak);
  const reset = useStore((s) => s.reset);

  const cleanDays = logs.filter((l: DayLog) => l.count === 0).length;
  const totalConsumed = logs.reduce(
    (sum: number, l: DayLog) => sum + l.count,
    0,
  );
  const avgPerDay =
    logs.length > 0 ? (totalConsumed / logs.length).toFixed(1) : 0;

  const bestStreak = (() => {
    let best = 0,
      cur = 0;
    const sorted = [...logs].sort((a: DayLog, b: DayLog) => a.day - b.day);
    for (const l of sorted) {
      if (l.count === 0) {
        cur++;
        best = Math.max(best, cur);
      } else cur = 0;
    }
    return best;
  })();

  const confirmReset = () => {
    Alert.alert("Recommencer ?", "Toutes tes données seront effacées.", [
      { text: "Annuler", style: "cancel" },
      { text: "Oui, recommencer", style: "destructive", onPress: reset },
    ]);
  };

  const metrics: {
    label: string;
    value: string | number;
    color: string;
    icon: IoniconsName;
  }[] = [
    {
      label: "Position",
      value: `${position}/30`,
      color: COLORS.success,
      icon: "triangle",
    },
    {
      label: "Streak actuel",
      value: `${streak} jours`,
      color: COLORS.orange,
      icon: "flame",
    },
    {
      label: "Meilleur streak",
      value: `${bestStreak} jours`,
      color: COLORS.gold,
      icon: "star",
    },
    {
      label: "Jours clean",
      value: cleanDays,
      color: COLORS.success,
      icon: "checkmark-circle",
    },
    {
      label: "Moy. par jour",
      value: `${avgPerDay} ${user?.addiction?.unit || ""}`,
      color: COLORS.info,
      icon: "trending-down",
    },
    {
      label: "Jours loggés",
      value: `${logs.length}/30`,
      color: "#c084fc",
      icon: "calendar",
    },
  ];

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.pageTitleRow}>
          <Ionicons name="bar-chart" size={24} color={COLORS.textPrimary} />
          <Text style={styles.pageTitle}> Mes Stats</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileIconWrap}>
            <Ionicons
              name={user?.avatar?.iconName ?? "person"}
              size={36}
              color={COLORS.gold}
            />
          </View>
          <View>
            <Text style={styles.profileName}>{user?.pseudo}</Text>
            <Text style={styles.profileSub}>{user?.addiction?.label}</Text>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          {metrics.map((m) => (
            <View key={m.label} style={styles.metricCard}>
              <Ionicons
                name={m.icon}
                size={18}
                color={m.color}
                style={{ marginBottom: 4 }}
              />
              <Text style={[styles.metricValue, { color: m.color }]}>
                {m.value}
              </Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionTitleRow}>
          <Ionicons name="list" size={16} color={COLORS.textPrimary} />
          <Text style={styles.sectionTitle}> Historique</Text>
        </View>

        {logs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="document-text-outline"
              size={40}
              color={COLORS.textMuted}
            />
            <Text style={styles.emptyText}>
              Pas encore de logs. Logger ta première journée !
            </Text>
          </View>
        ) : (
          [...logs].reverse().map((l: DayLog) => {
            const isClean = l.count === 0;
            const date = new Date(l.date).toLocaleDateString("fr-FR", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });
            return (
              <View key={l.day} style={styles.logRow}>
                <Text style={styles.logDay}>J{l.day}</Text>
                <Text style={styles.logDate}>{date}</Text>
                <View
                  style={[
                    styles.logCount,
                    {
                      backgroundColor: isClean
                        ? COLORS.successDim
                        : COLORS.dangerDim,
                    },
                  ]}
                >
                  <Ionicons
                    name={isClean ? "happy-outline" : "alert-circle-outline"}
                    size={14}
                    color={isClean ? COLORS.success : COLORS.danger}
                  />
                  <Text
                    style={[
                      styles.logCountText,
                      { color: isClean ? COLORS.success : COLORS.danger },
                    ]}
                  >
                    {" "}
                    {isClean
                      ? "ZÉRO"
                      : `${l.count} ${user?.addiction?.unit || ""}`}
                  </Text>
                </View>
              </View>
            );
          })
        )}

        <TouchableOpacity onPress={confirmReset} style={styles.resetBtn}>
          <Ionicons name="refresh" size={16} color={COLORS.danger} />
          <Text style={styles.resetText}> Recommencer à zéro</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { padding: SPACING.xl, paddingTop: 60, paddingBottom: 100 },
  pageTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
  },
  pageTitle: {
    fontSize: FONT_SIZE["3xl"],
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textPrimary,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
  },
  profileIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.goldBorder,
  },
  profileName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.black,
  },
  profileSub: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm + 2,
    marginBottom: SPACING["2xl"],
  },
  metricCard: {
    width: "47%",
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
  },
  metricValue: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: FONT_WEIGHT.black,
    marginBottom: SPACING.xs,
  },
  metricLabel: { color: COLORS.textMuted, fontSize: FONT_SIZE.sm },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.base,
  },
  emptyState: { alignItems: "center", padding: SPACING["3xl"] },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: "center",
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.md,
  },
  logRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm + 2,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  logDay: {
    color: COLORS.gold,
    fontWeight: FONT_WEIGHT.black,
    width: 30,
    fontSize: FONT_SIZE.md,
  },
  logDate: { color: COLORS.textMuted, fontSize: FONT_SIZE.sm, flex: 1 },
  logCount: {
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    flexDirection: "row",
    alignItems: "center",
  },
  logCountText: { fontWeight: FONT_WEIGHT.bold, fontSize: FONT_SIZE.md },
  resetBtn: {
    marginTop: SPACING["2xl"],
    padding: SPACING.lg,
    backgroundColor: COLORS.dangerDim,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    flexDirection: "row",
    justifyContent: "center",
  },
  resetText: {
    color: COLORS.danger,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.base,
  },
});
