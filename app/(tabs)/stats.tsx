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
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { mockStats } from "@/src/mocks/testData";

export default function StatsScreen() {
  const user = useStore((s) => s.user);
  const logs = useStore((s) => s.logs);
  const position = useStore((s) => s.position);
  const streak = useStore((s) => s.streak);
  const reset = useStore((s) => s.reset);

  //////////////////////////////////////////////////////////
  // const DEBUG = true;
  // const user = useStore((s) => s.user);
  // const position = DEBUG ? mockStats.position : useStore((s) => s.position);
  // const streak = DEBUG ? mockStats.streak : useStore((s) => s.streak);
  // const logs = DEBUG ? mockStats.logs : useStore((s) => s.logs);
  ////////////////////////////////////////////////////////////////

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
      icon: "map",
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
      color: COLORS.info,
      icon: "calendar",
    },
  ];

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.pageTitleRow}>
          <Ionicons name="bar-chart" size={24} color={COLORS.gold} />
          <Text style={styles.pageTitle}> Mes Stats</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileIconWrap}>
            <Image
              source={user?.avatar?.image}
              style={{ width: 36, height: 36 }}
            />
          </View>
          <View>
            <Text style={styles.profileName}>{user?.pseudo}</Text>
            <View style={styles.profileRow}>
              <Text style={styles.profileSub}>{user?.addiction?.label}</Text>
              <Ionicons
                name={user?.addiction?.iconName}
                size={14}
                color={COLORS.textSecondary}
              />
            </View>
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
                <View style={[styles.logCount]}>
                  <Ionicons
                    name={isClean ? "happy-outline" : "sad-outline"}
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
          <Ionicons name="refresh" size={20} color={COLORS.danger} />
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
    gap: 10,
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
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  profileSub: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING["2xl"],
  },
  metricCard: {
    flexGrow: 1,
    flexBasis: "48%",
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  metricValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.black,
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  metricLabel: { color: COLORS.textMuted, fontSize: FONT_SIZE.sm },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    gap: 5,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.base,
  },
  emptyState: { alignItems: "center", padding: SPACING["3xl"] },
  emptyText: {
    color: COLORS.textSecondary,
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  resetText: {
    color: COLORS.danger,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.lg,
  },
});
