import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ClimberWall from "@/src/components/ClimberWall";
import DayTracker from "@/src/components/DayTracker";
import ChuteLiBreModal from "@/src/components/ChuteLiBreModal";
import LogModal from "@/src/components/Logmodal";
import TrophyModal from "@/src/components/Trophymodal";
import ObjectifBlock from "@/src/components/Objectifblock";
import motivationsData from "@/src/data/motivations.json";
import useStore from "@/src/store/useStore";
import {
  getDeltaInfo,
  getSecondsUntilNextTick,
  computePointsToNextLevel,
  getTickIntervalSecondsFinal,
} from "@/src/utils/calculations";
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@/src/utils/theme";

export default function HomeScreen() {
  const user = useStore((s) => s.user);
  const position = useStore((s) => s.position);
  const streak = useStore((s) => s.streak);
  const logs = useStore((s) => s.logs);
  const todayLog = useStore((s) => s.todayLog);
  const dayNumber = useStore((s) => s.dayNumber);
  const newTrophy = useStore((s) => s.newTrophy);
  const clearNewTrophy = useStore((s) => s.clearNewTrophy);
  const logDay = useStore((s) => s.logDay);
  const score = useStore((s) => s.score);
  const lastTickTime = useStore((s) => s.lastTickTime);
  const startDate = useStore((s) => s.startDate);
  const tickHourly = useStore((s) => s.tickHourly);
  const reportRelapse = useStore((s) => s.reportRelapse);
  const relapseCount = useStore((s) => s.relapseCount);
  const dailyCount = useStore((s) => s.dailyCount);
  const setDailyCount = useStore((s) => s.setDailyCount);
  const decrementDailyCount = useStore((s) => s.decrementDailyCount);

  const insets = useSafeAreaInsets();
  const [logModal, setLogModal] = useState(false);
  const [chuteModal, setChuteModal] = useState(false);
  const [count, setCount] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(3600);

  const [motivation] = useState(() => {
    const l = motivationsData.motivations;
    return l[Math.floor(Math.random() * l.length)];
  });
  const [relapseMotivation] = useState(() => {
    const l = motivationsData.relapseMotivations;
    return l[Math.floor(Math.random() * l.length)];
  });

  const scrollRef = useRef<ScrollView>(null);
  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.flashScrollIndicators();
    }, []),
  );

  useEffect(() => {
    const update = () => {
      setSecondsLeft(getSecondsUntilNextTick(lastTickTime, position));
      tickHourly();
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [lastTickTime, position]);

  const submitLog = () => {
    logDay(parseInt(count) || 0);
    setLogModal(false);
    setCount("");
    Keyboard.dismiss();
  };

  const deltaInfo = getDeltaInfo(parseInt(count) || 0, undefined, position);

  const intervalLabel = (() => {
    const secs = getTickIntervalSecondsFinal(position);
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return m > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${h}h`;
  })();

  const timerWarning =
    secondsLeft > 60
      ? `${Math.floor(secondsLeft / 60)} min restantes`
      : secondsLeft > 0
        ? `${secondsLeft}s restantes`
        : null;

  const timerMinutes = Math.floor(secondsLeft / 60);
  const timerSeconds = secondsLeft % 60;

  return (
    <View style={s.bg}>
      <ScrollView
        ref={scrollRef}
        onScrollBeginDrag={Keyboard.dismiss}
        contentContainerStyle={[
          s.container,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.header}>
          <View style={{ gap: 4 }}>
            <View style={s.userRow}>
              <Image
                source={user?.avatar?.image}
                style={{ width: 35, height: 35 }}
              />
              <Text style={s.greeting}>Salut {user?.pseudo}</Text>
            </View>
            <View style={s.profileRow}>
              <Text style={s.subGreeting}>
                Niveau {position}/30 • Cigarettes{" "}
              </Text>
              <Ionicons
                name="logo-no-smoking"
                size={14}
                color={COLORS.textSecondary}
              />
            </View>
          </View>
          <View style={s.streakPill}>
            <Ionicons name="flame" size={14} color={COLORS.orange} />
            <Text style={s.streakText}> {streak} jours</Text>
          </View>
        </View>

        <View style={s.motivationBox}>
          <Ionicons
            name="chatbubble-ellipses"
            size={20}
            color={COLORS.gold}
            style={{ marginBottom: 2 }}
          />
          <Text style={s.motivationText}>{motivation}</Text>
        </View>

        <ClimberWall
          position={position}
          avatar={user?.avatar ?? null}
          streak={streak}
          fullWidth
        />

        <View style={s.card}>
          <View style={s.timerRow}>
            <View style={s.timerLeft}>
              <View style={{ alignItems: "center", gap: 4 }}>
                <Ionicons name="timer" size={30} color={COLORS.gold} />
                <Text style={s.timerWin}>+50 <Ionicons name="star" size={12} color={COLORS.gold} /></Text>
              </View>
              <View style={{ gap: 4 }}>
                <Text style={[s.timerLabel, { fontSize: 12, opacity: 0.6 }]}>
                  {`Intervalle : ${intervalLabel} • actif 7h-23h`}
                </Text>
                {position < 30 ? (
                  <Text
                    style={[s.timerLabel, { fontSize: 12, opacity: 0.75 }]}
                  >{`Niv. suivant dans ${computePointsToNextLevel(score)} pts`}</Text>
                ) : (
                  <Text style={[s.timerLabel, { fontSize: 12, opacity: 0.75 }]}>
                    Sommet atteint ! <Ionicons name="trophy" size={16} color={COLORS.gold} />
                  </Text>
                )}
              </View>
            </View>

            <View style={s.timerDisplay}>
              {secondsLeft === 0 ? (
                <Text style={s.timerReady}>+50 pts{"\n"}dispo !</Text>
              ) : (
                <>
                  <Text style={s.timerBigNum}>
                    {String(timerMinutes).padStart(2, "0")}
                  </Text>
                  <Text style={s.timerUnit}>min</Text>
                  <Text style={s.timerBigNum}>
                    {String(timerSeconds).padStart(2, "0")}
                  </Text>
                  <Text style={s.timerUnit}>sec</Text>
                </>
              )}
            </View>
          </View>
        </View>

        <ObjectifBlock
          dailyCount={dailyCount}
          onSetObjectif={setDailyCount}
          onDecrement={decrementDailyCount}
        />

        <View style={s.card}>
          <View style={s.row}>
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={s.relapseLabel}>Tu as fait une chute ?</Text>
              <Text style={s.relapseSub}>
                Ça arrive. L'important est de continuer à grimper.
              </Text>
              {secondsLeft > 0 && (
                <Text style={s.timerWarning}>
                  Remet le timer à zéro
                  {timerWarning ? ` (${timerWarning})` : ""}
                </Text>
              )}
              {relapseCount > 0 && (
                <View style={s.relapseCountRow}>
                  <Ionicons name="fitness" size={11} color={COLORS.danger} />
                  <Text style={s.relapseCountText}>
                    {relapseCount} chute{relapseCount > 1 ? "s" : ""}{" "}
                    aujourd'hui
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={reportRelapse} style={s.relapseBtn}>
              <Ionicons name="fitness" size={16} color="#fff" />
              <Text style={s.relapseBtnText}>Oui</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[s.card, { alignItems: "center", gap: 6 }]}>
          <Ionicons
            name="chatbubble-ellipses"
            size={20}
            color={COLORS.textMuted}
          />
          <Text style={s.relapseMotivText}>{relapseMotivation}</Text>
        </View>

        <TouchableOpacity
          onPress={() => setChuteModal(true)}
          style={s.chuteBtn}
        >
          <Ionicons name="umbrella" size={20} color="#fff" />
          <View>
            <Text style={s.chuteBtnTitle}>Chute libre</Text>
            <Text style={s.chuteBtnSub}>
              Envie forte ? Appuie ici avant de craquer.
            </Text>
          </View>
        </TouchableOpacity>

        <View style={s.statsRow}>
          {[
            {
              icon: "trending-up",
              value: `${Math.round((position / 30) * 100)}%`,
              label: "Progression",
              color: COLORS.textPrimary,
            },
            {
              icon: "flag",
              value: `${position}/30`,
              label: "Niveau",
              color: COLORS.success,
            },
            {
              icon: "star",
              value: `${score}`,
              label: "Score",
              color: COLORS.gold,
            },
            {
              icon: "calendar",
              value: `${logs.length}`,
              label: "Jours loggés",
              color: COLORS.info,
            },
          ].map((m) => (
            <View key={m.label} style={s.statCard}>
              <Ionicons name={m.icon as any} size={15} color={m.color} />
              <Text style={[s.statValue, { color: m.color }]}>{m.value}</Text>
              <Text style={s.statLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        {!todayLog ? (
          <TouchableOpacity
            onPress={() => setLogModal(true)}
            style={s.logBtnWrap}
          >
            <View style={s.logBtn}>
              <Ionicons
                name="add-circle"
                size={24}
                color={COLORS.bgSecondary}
              />
              <Text style={s.logBtnText}>Logger aujourd'hui</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={s.loggedBox}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={COLORS.textSecondary}
              />
              <Text style={s.loggedText}>
                Loggé : {todayLog.count} cigarette(s)
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setCount(todayLog.count.toString());
                setLogModal(true);
              }}
            >
              <Text style={s.editLog}>Modifier</Text>
            </TouchableOpacity>
          </View>
        )}

        <DayTracker
          logs={logs}
          startDate={startDate}
          relapseCount={relapseCount}
        />
      </ScrollView>

      <LogModal
        visible={logModal}
        count={count}
        onChangeCount={setCount}
        onClose={() => {
          setLogModal(false);
          setCount("");
        }}
        onSubmit={submitLog}
        deltaInfo={deltaInfo}
      />

      <TrophyModal trophy={newTrophy} onClose={clearNewTrophy} />

      <ChuteLiBreModal
        visible={chuteModal}
        onClose={() => setChuteModal(false)}
        avatar={user?.avatar?.image}
      />
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  container: { paddingHorizontal: SPACING.xl, gap: SPACING.sm },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  greeting: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  subGreeting: { color: COLORS.textSecondary, fontSize: FONT_SIZE.md },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  streakPill: {
    backgroundColor: COLORS.dangerDim,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    color: COLORS.orange,
    fontWeight: "800",
    fontSize: FONT_SIZE.md,
  },
  motivationBox: {
    backgroundColor: COLORS.goldDim,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderColor: COLORS.goldBorder,
    alignItems: "center",
    gap: 4,
  },
  motivationText: {
    color: COLORS.gold,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
  },
  row: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    flex: 1,
  },
  timerWin: {
    color: COLORS.gold,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.sm,
  },
  timerLabel: {
    color: COLORS.gold,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.md,
  },
  timerDisplay: { alignItems: "center", minWidth: 56 },
  timerBigNum: {
    color: COLORS.gold,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE["2xl"],
    lineHeight: 28,
  },
  timerUnit: {
    color: COLORS.gold,
    fontSize: FONT_SIZE.xs,
    opacity: 0.7,
    lineHeight: 14,
  },
  timerReady: {
    color: COLORS.success,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
  },

  relapseLabel: {
    color: COLORS.danger,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.base,
  },
  relapseSub: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },
  timerWarning: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontStyle: "italic",
  },
  relapseCountRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  relapseCountText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
  },
  relapseBtn: {
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  relapseBtnText: {
    color: "#fff",
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.base,
  },
  relapseMotivText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },
  chuteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  chuteBtnTitle: {
    color: "#fff",
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.base,
  },
  chuteBtnSub: { color: "rgba(255,255,255,0.75)", fontSize: FONT_SIZE.sm },
  statsRow: { flexDirection: "row", gap: SPACING.sm },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    gap: 2,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    textAlign: "center",
  },
  logBtnWrap: {},
  logBtn: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.gold,
  },
  logBtnText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
    color: COLORS.bgPrimary,
  },
  loggedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.bgSecondary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  loggedText: {
    color: COLORS.textSecondary,
    fontWeight: "700",
    fontSize: FONT_SIZE.md,
  },
  editLog: { color: COLORS.gold, fontWeight: "700", fontSize: FONT_SIZE.md },
});
