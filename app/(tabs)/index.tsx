import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ClimberWall from "@/src/components/ClimberWall";
import DayTracker from "@/src/components/DayTracker";
import motivationsData from "@/src/data/motivations.json";
import useStore from "@/src/store/useStore";
import {
  getDeltaInfo,
  getSecondsUntilNextTick,
  computePointsToNextLevel,
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
  const tickHourly = useStore((s) => s.tickHourly);
  const [secondsLeft, setSecondsLeft] = useState(3600);
  const reportRelapse = useStore((s) => s.reportRelapse);
  const relapseCount = useStore((s) => s.relapseCount);

  const insets = useSafeAreaInsets();
  const [logModal, setLogModal] = useState(false);
  const [count, setCount] = useState("");
  const [motivation] = useState(() => {
    const list = motivationsData.motivations;
    return list[Math.floor(Math.random() * list.length)];
  });
  const [relapseMotivation] = useState(() => {
    const list = motivationsData.relapseMotivations;
    return list[Math.floor(Math.random() * list.length)];
  });

  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.flashScrollIndicators();
    }, []),
  );

  useEffect(() => {
    const update = () => {
      setSecondsLeft(getSecondsUntilNextTick(lastTickTime));
      tickHourly();
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [lastTickTime]);

  const submitLog = () => {
    const num = parseInt(count) || 0;
    logDay(num);
    setLogModal(false);
    setCount("");
    Keyboard.dismiss();
  };

  const deltaInfo = getDeltaInfo(parseInt(count) || 0, user?.addiction?.id);

  return (
    <View style={styles.bg}>
      <ScrollView
        ref={scrollRef}
        onScrollBeginDrag={Keyboard.dismiss}
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={{ gap: 5 }}>
            <View style={styles.userRow}>
              <Image
                source={user?.avatar?.image}
                style={{ width: 35, height: 35 }}
              />
              <Text style={styles.greeting}>Salut {user?.pseudo}</Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
            >
              <Text style={styles.subGreeting}>
                Niveau {position}/30 • {user?.addiction?.label}
              </Text>
              <Ionicons
                name={user?.addiction?.iconName}
                size={14}
                color={COLORS.textSecondary}
              />
            </View>
          </View>
          <View style={styles.streakPill}>
            <Ionicons name="flame" size={14} color={COLORS.orange} />
            <Text style={styles.streakText}> {streak} jours</Text>
          </View>
        </View>

        <View style={styles.motivationBox}>
          <Ionicons
            name="chatbubble-ellipses"
            size={24}
            color={COLORS.gold}
            style={{ marginBottom: 4 }}
          />
          <Text style={styles.motivationText}>{motivation}</Text>
        </View>

        <ClimberWall
          position={position}
          avatar={user?.avatar ?? null}
          streak={streak}
          fullWidth
        />

        <View style={styles.combinedBox}>
          <View style={styles.timerRow}>
            <View style={styles.timerLeft}>
              <Ionicons name="timer" size={18} color={COLORS.gold} />
              <View>
                <Text style={styles.timerLabel}>
                  {secondsLeft === 0
                    ? "Gain disponible !"
                    : `+50 pts dans ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`}
                </Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  {position < 30 ? (
                    <Text
                      style={[
                        styles.timerLabel,
                        { fontSize: 11, opacity: 0.75 },
                      ]}
                    >
                      {`Niveau suivant dans ${computePointsToNextLevel(score)} pts`}
                    </Text>
                  ) : (
                    <>
                      <Text
                        style={[
                          styles.timerLabel,
                          { fontSize: 11, opacity: 0.75 },
                        ]}
                      >
                        Sommet atteint !
                      </Text>
                      <Ionicons
                        name="trophy"
                        size={11}
                        color={COLORS.gold}
                        style={{ opacity: 0.75 }}
                      />
                    </>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.timerScorePill}>
              <Ionicons name="star" size={12} color={COLORS.gold} />
              <Text style={styles.timerScore}>
                {secondsLeft === 0 ? score : score + 50} pts
              </Text>
            </View>
          </View>

          <View style={styles.combinedSeparator} />

          <View style={styles.relapseRow}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Text style={styles.relapseText}>Tu as fait une chute ?</Text>
              {relapseCount > 0 && (
                <View style={styles.relapseCountPill}>
                  <Ionicons name="fitness" size={11} color={COLORS.danger} />
                  <Text style={styles.relapseCountText}>{relapseCount}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={reportRelapse} style={styles.relapseBtn}>
              <Ionicons name="fitness" size={14} color={COLORS.danger} />
              <Text style={styles.relapseBtnText}>Oui</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.motivationBox2}>
            <Ionicons
              name="chatbubble-ellipses"
              size={24}
              color={COLORS.textMuted}
              style={{ marginBottom: 4 }}
            />
            <Text style={styles.motivationText2}>{relapseMotivation}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={16} color={COLORS.textPrimary} />
            <Text style={styles.statValue}>
              {Math.round((position / 30) * 100)}%
            </Text>
            <Text style={styles.statLabel}>Progression</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flag" size={16} color={COLORS.success} />
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              {position}/30
            </Text>
            <Text style={styles.statLabel}>Niveau</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={16} color={COLORS.gold} />
            <Text style={[styles.statValue, { color: COLORS.gold }]}>
              {score}
            </Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={COLORS.success}
            />
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              {logs.filter((l) => l.count === 0).length}
            </Text>
            <Text style={styles.statLabel}>Jours clean</Text>
          </View>
        </View>

        {!todayLog ? (
          <TouchableOpacity
            onPress={() => setLogModal(true)}
            style={styles.logBtnWrap}
          >
            <View style={styles.logBtn}>
              <Ionicons
                name="add-circle"
                size={24}
                color={COLORS.bgSecondary}
              />
              <Text style={styles.logBtnText}>Logger aujourd'hui</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.loggedBox}>
            <View style={styles.loggedLeft}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={COLORS.textSecondary}
              />
              <Text style={styles.loggedText}>
                Loggé : {todayLog.count} {user?.addiction?.unit}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setCount(todayLog.count.toString());
                setLogModal(true);
              }}
            >
              <Text style={styles.editLog}>Modifier</Text>
            </TouchableOpacity>
          </View>
        )}

        <DayTracker logs={logs} currentDay={dayNumber} />
      </ScrollView>

      <Modal visible={logModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ width: "100%" }}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modal}>
                  <TouchableOpacity
                    onPress={() => {
                      setLogModal(false);
                      setCount("");
                    }}
                    style={styles.closeBtn}
                  >
                    <Ionicons name="close" size={22} color={COLORS.textMuted} />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Combien aujourd'hui ?</Text>
                  <Text style={styles.modalSub}>
                    {user?.addiction?.label} - Sois honnête avec toi-même
                  </Text>

                  <View style={styles.quickRow}>
                    {["0", "1", "2", "5", "10"].map((n) => (
                      <TouchableOpacity
                        key={n}
                        style={[
                          styles.quickBtn,
                          count === n && styles.quickBtnActive,
                        ]}
                        onPress={() => setCount(n)}
                      >
                        <Text
                          style={[
                            styles.quickText,
                            count === n && styles.quickTextActive,
                          ]}
                        >
                          {n}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TextInput
                    style={styles.modalInput}
                    keyboardType="number-pad"
                    value={count}
                    onChangeText={setCount}
                    placeholder="0"
                    placeholderTextColor="#555"
                    maxLength={3}
                  />
                  <Text style={styles.unitLabel}>{user?.addiction?.unit}</Text>

                  {count !== "" && (
                    <View
                      style={[
                        styles.deltaBox,
                        { borderColor: deltaInfo.color },
                      ]}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Ionicons
                          name={deltaInfo.icon}
                          size={24}
                          color={deltaInfo.color}
                        />
                        <Text
                          style={[styles.deltaText, { color: deltaInfo.color }]}
                        >
                          {deltaInfo.text}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.modalBtns}>
                    <TouchableOpacity
                      onPress={() => {
                        setLogModal(false);
                        setCount("");
                      }}
                      style={styles.cancelBtn}
                    >
                      <Text style={styles.cancelText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={submitLog} style={{ flex: 1 }}>
                      <View style={styles.confirmBtn}>
                        <Text style={styles.confirmText}>Valider</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {newTrophy && (
        <Modal visible transparent animationType="fade">
          <View style={styles.trophyOverlay}>
            <View style={styles.trophyModal}>
              <Ionicons
                name="trophy"
                size={72}
                color={COLORS.gold}
                style={{ marginBottom: 16 }}
              />
              <Text style={styles.trophyLabel}>Trophée débloqué !</Text>
              <Text style={styles.trophyName}>{newTrophy.title}</Text>
              <Text style={styles.trophyDesc}>{newTrophy.desc}</Text>
              <TouchableOpacity
                onPress={clearNewTrophy}
                style={{ width: "100%" }}
              >
                <View style={styles.confirmBtn}>
                  <Text style={styles.confirmText}>Super !</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { paddingHorizontal: SPACING.xl },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  greeting: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  subGreeting: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: 2,
  },
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
    marginBottom: SPACING.md,
    borderColor: COLORS.goldBorder,
    alignItems: "center",
  },
  motivationBox2: {
    padding: SPACING.md,
    gap: 5,
    marginBottom: SPACING.md,
    borderColor: COLORS.goldBorder,
    alignItems: "center",
  },
  motivationText: {
    color: COLORS.gold,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },
  motivationText2: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },
  combinedBox: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    overflow: "hidden",
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  timerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  combinedSeparator: {
    height: 1,
    backgroundColor: COLORS.bgCardBorder,
  },
  relapseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  timerLabel: {
    color: COLORS.gold,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.md,
  },
  timerScorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  timerScore: {
    color: COLORS.gold,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.sm,
  },
  relapseText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  relapseBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(156,53,40,0.15)",
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
  },
  relapseBtnText: {
    color: COLORS.danger,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.md,
  },
  relapseCountPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: "rgba(156,53,40,0.3)",
  },
  relapseCountText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.black,
  },
  statsRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.md },
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
    marginTop: 1,
    textAlign: "center",
  },
  logBtnWrap: { marginBottom: SPACING.md },
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
    marginBottom: SPACING.md,
  },
  loggedLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  loggedText: {
    color: COLORS.textSecondary,
    fontWeight: "700",
    fontSize: FONT_SIZE.md,
  },
  editLog: { color: COLORS.gold, fontWeight: "700", fontSize: FONT_SIZE.md },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: COLORS.bgSecondary,
    borderTopLeftRadius: RADIUS["2xl"],
    borderTopRightRadius: RADIUS["2xl"],
    padding: SPACING["2xl"],
    paddingBottom: SPACING["4xl"],
  },
  closeBtn: { alignSelf: "flex-end", marginBottom: SPACING.sm },
  modalTitle: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: "900",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  modalSub: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.md,
    fontSize: FONT_SIZE.md,
  },
  quickRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  quickBtn: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  quickBtnActive: { borderColor: COLORS.gold, backgroundColor: COLORS.goldDim },
  quickText: {
    color: COLORS.textSecondary,
    fontWeight: "700",
    fontSize: FONT_SIZE.lg,
  },
  quickTextActive: { color: COLORS.gold },
  modalInput: {
    fontSize: FONT_SIZE.hero,
    fontWeight: "900",
    color: COLORS.gold,
    textAlign: "center",
    marginBottom: 4,
  },
  unitLabel: {
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: SPACING.md,
    fontSize: FONT_SIZE.base,
  },
  deltaBox: {
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    alignItems: "center",
  },
  deltaText: { fontWeight: "800", fontSize: FONT_SIZE.lg },
  modalBtns: { flexDirection: "row", gap: SPACING.md },
  cancelBtn: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgCard,
    alignItems: "center",
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontWeight: "700",
    fontSize: FONT_SIZE.base,
  },
  confirmBtn: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    backgroundColor: COLORS.gold,
  },
  confirmText: {
    color: COLORS.bgSecondary,
    fontWeight: "700",
    fontSize: FONT_SIZE.base,
  },
  trophyOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING["3xl"],
  },
  trophyModal: {
    borderRadius: RADIUS["2xl"],
    padding: SPACING["3xl"],
    alignItems: "center",
    width: "100%",
  },
  trophyLabel: {
    color: COLORS.gold,
    fontSize: FONT_SIZE["2xl"],
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  trophyName: {
    color: COLORS.gold,
    fontSize: FONT_SIZE["3xl"],
    fontWeight: "900",
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  trophyDesc: {
    color: COLORS.gold,
    fontSize: FONT_SIZE.base,
    textAlign: "center",
    marginBottom: SPACING["2xl"],
  },
});
