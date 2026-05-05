import useStore, { TROPHY_DEFS } from "@/src/store/useStore";
import { IoniconsName } from "@/src/utils/icons";
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@/src/utils/theme";
import { Trophy } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
// import { mockUnlockedTrophies } from "@/src/mocks/testData";

const TROPHY_ICONS: Record<string, IoniconsName> = {
  t1: "leaf",
  t2: "flame",
  t3: "flash",
  t4: "heart-half",
  t5: "sparkles",
  t6: "trophy",
  t7: "medal",
  t8: "barbell",
};

export default function TrophiesScreen() {
  const unlockedTrophies = useStore((s) => s.unlockedTrophies);

  /////////////////////////////////////////////////
  // const unlockedTrophies = mockUnlockedTrophies;
  /////////////////////////////////////////////////

  const streak = useStore((s) => s.streak);
  const logs = useStore((s) => s.logs);

  const trophies: (Trophy & { unlocked: boolean })[] = TROPHY_DEFS.map(
    (t: Trophy) => ({ ...t, unlocked: unlockedTrophies.includes(t.id) }),
  );
  const unlockedCount = trophies.filter((t) => t.unlocked).length;

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.pageTitleRow}>
          <Ionicons name="trophy" size={24} color={COLORS.gold} />
          <Text style={styles.pageTitle}> Mes Trophées</Text>
        </View>
        <Text style={styles.pageSub}>
          {unlockedCount}/{trophies.length} débloqués
        </Text>

        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${(unlockedCount / trophies.length) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((unlockedCount / trophies.length) * 100)}%
          </Text>
        </View>

        <View style={styles.statsRow}>
          {[
            { num: streak, lab: "Streak", icon: "flame" as const },
            {
              num: logs.filter((l) => l.count === 0).length,
              lab: "Jours clean",
              icon: "star" as const,
            },
            {
              num: logs.length,
              lab: "Jours loggés",
              icon: "calendar" as const,
            },
          ].map((s) => (
            <View key={s.lab} style={styles.statBox}>
              <Ionicons name={s.icon} size={18} color={COLORS.gold} />
              <Text style={styles.statNum}>{s.num}</Text>
              <Text style={styles.statLab}>{s.lab}</Text>
            </View>
          ))}
        </View>

        <View style={styles.grid}>
          {trophies.map((t) => {
            const iconName = TROPHY_ICONS[t.id] ?? "medal";
            return (
              <View
                key={t.id}
                style={[
                  styles.trophyCard,
                  t.unlocked && styles.trophyCardUnlocked,
                ]}
              >
                {t.unlocked ? (
                  <View
                    style={styles.trophyGrad}
                  >
                    <Ionicons name={iconName} size={32} color={COLORS.gold} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.trophyTitle}>{t.title}</Text>
                      <Text style={styles.trophyDesc}>{t.desc}</Text>
                    </View>
                    <View style={styles.unlockedBadge}>
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={COLORS.success}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.trophyLocked}>
                    <Ionicons
                      name="lock-closed"
                      size={28}
                      color={COLORS.textMuted}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.trophyTitleLocked}>{t.title}</Text>
                      <Text style={styles.trophyDescLocked}>{t.desc}</Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
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
    gap: 10,
  },
  pageTitle: {
    fontSize: FONT_SIZE["3xl"],
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textPrimary,
  },
  pageSub: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
    fontSize: FONT_SIZE.md,
  },
  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm + 2,
    marginBottom: SPACING.xl,
  },
  progressBg: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: RADIUS.sm,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: RADIUS.sm, backgroundColor: COLORS.gold, },
  progressText: {
    color: COLORS.gold,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.sm,
    width: 36,
    textAlign: "right",
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACING.sm + 2,
    marginBottom: SPACING["2xl"],
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    gap: 4,
  },
  statNum: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE["2xl"],
    fontWeight: FONT_WEIGHT.black,
  },
  statLab: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.md,
    marginTop: 2,
    textAlign: "center",
  },
  grid: { gap: SPACING.md },
  trophyCard: {
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
  },
  trophyCardUnlocked: { borderColor: COLORS.goldBorder },
  trophyGrad: {
    padding: SPACING.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
  },
  trophyTitle: {
    color: COLORS.gold,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.base,
  },
  trophyDesc: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
    lineHeight: 18,
  },
  unlockedBadge: {
    borderRadius: RADIUS.sm,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  trophyLocked: {
    backgroundColor: COLORS.bgCard,
    padding: SPACING.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
    opacity: 0.5,
  },
  trophyTitleLocked: {
    color: COLORS.textMuted,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.base,
  },
  trophyDescLocked: {
    color: COLORS.tabInactive,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
});
