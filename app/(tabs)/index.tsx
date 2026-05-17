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
import ChuteLiBreModal from "@/src/components/ChuteLiBreModal";
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
  const [objectifInput, setObjectifInput] = useState("");
  const [objectifDefined, setObjectifDefined] = useState(false);

  useEffect(() => {
    if (dailyCount > 0) setObjectifDefined(true);
  }, []);
  useEffect(() => {
    if (dailyCount === 0) {
      setObjectifDefined(false);
      setObjectifInput("");
    }
  }, [dailyCount]);

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

  const submitObjectif = () => {
    const val = parseInt(objectifInput);
    if (isNaN(val) || val < 0) return;
    setDailyCount(val);
    setObjectifDefined(true);
    Keyboard.dismiss();
  };

  const deltaInfo = getDeltaInfo(parseInt(count) || 0, undefined, position);

  const intervalLabel = (() => {
    const secs = getTickIntervalSecondsFinal(position);
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return m > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${h}h`;
  })();

  const remainingColor =
    dailyCount === 0
      ? COLORS.success
      : dailyCount <= 2
        ? COLORS.warning
        : COLORS.textPrimary;

  const timerWarning =
    secondsLeft > 60
      ? `${Math.floor(secondsLeft / 60)} min restantes`
      : secondsLeft > 0
        ? `${secondsLeft}s perdues`
        : null;

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
                Niveau {position}/30 • Cigarettes 
              </Text>
              <Ionicons name="logo-no-smoking" size={14} color={COLORS.textSecondary} />
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
              <Ionicons name="timer" size={20} color={COLORS.gold} />
              <View style={{ gap: 2 }}>
                <Text style={s.timerLabel}>
                  {secondsLeft === 0
                    ? "Gain disponible !"
                    : `+50 pts dans ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`}
                </Text>
                <Text style={[s.timerLabel, { fontSize: 10, opacity: 0.6 }]}>
                  {`Intervalle : ${intervalLabel} • actif 7h-23h`}
                </Text>
                {position < 30 ? (
                  <Text
                    style={[s.timerLabel, { fontSize: 11, opacity: 0.75 }]}
                  >{`Niveau suivant dans ${computePointsToNextLevel(score)} pts`}</Text>
                ) : (
                  <Text style={[s.timerLabel, { fontSize: 11, opacity: 0.75 }]}>
                    Sommet atteint ! 
                  </Text>
                )}
              </View>
            </View>
            <View style={s.scorePill}>
              <Ionicons name="star" size={12} color={COLORS.gold} />
              <Text style={s.scoreText}>{score} pts</Text>
            </View>
          </View>
        </View>

        <View style={s.card}>
          {!objectifDefined ? (
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={s.blockTitle}>Objectif du jour  <Ionicons name="golf" size={16} color={COLORS.gold} /></Text>
                <Text style={s.blockSub}>Aujourd'hui je compte fumer :</Text>
              </View>
              <View style={s.inputGroup}>
                <TextInput
                  style={s.numInput}
                  keyboardType="number-pad"
                  value={objectifInput}
                  onChangeText={setObjectifInput}
                  placeholder="0"
                  placeholderTextColor={COLORS.textMuted}
                  maxLength={2}
                  returnKeyType="done"
                  onSubmitEditing={submitObjectif}
                />
                <TouchableOpacity
                  style={[
                    s.confirmSmallBtn,
                    !objectifInput && { opacity: 0.4 },
                  ]}
                  onPress={submitObjectif}
                  disabled={!objectifInput}
                >
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={COLORS.bgPrimary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={s.row}>
              <View style={{ flex: 1, gap: 10 }}>
                <Text style={s.blockTitle}>Objectif du jour  <Ionicons name="golf" size={16} color={COLORS.gold} /></Text>
                <Text style={[s.remainingCount, { color: remainingColor }]}>
                  <Text style={[s.dailyText, {color: remainingColor}]}>{dailyCount}</Text> restante{dailyCount !== 1 ? "s" : ""}
                </Text>
                {dailyCount === 0 && (
                  <Text style={s.bravoText}>Objectif atteint !  <Ionicons name="flame" size={16} color={COLORS.gold} /></Text>
                )}
              </View>
              <View style={{ alignItems: "center", gap: 15 }}>
                <TouchableOpacity
                  style={[s.glisseeBtn, dailyCount === 0 && { opacity: 0.3 }]}
                  onPress={decrementDailyCount}
                  disabled={dailyCount === 0}
                >
                  <Ionicons name="hand-left" size={15} color={COLORS.danger} />
                  <Text style={s.glisseeBtnText}>Ma main{"\n"}a glissé</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setObjectifDefined(false);
                    setObjectifInput(String(dailyCount));
                  }}
                >
                  <Text style={s.linkText}>Modifier</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

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
              icon: "checkmark-circle",
              value: `${logs.filter((l) => l.count === 0).length}`,
              label: "Jours clean",
              color: COLORS.success,
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
          currentDay={dayNumber}
          relapseCount={relapseCount}
        />
      </ScrollView>

      <Modal visible={logModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={s.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ width: "100%" }}
            >
              <TouchableWithoutFeedback>
                <View style={s.modal}>
                  <TouchableOpacity
                    onPress={() => {
                      setLogModal(false);
                      setCount("");
                    }}
                    style={s.closeBtn}
                  >
                    <Ionicons name="close" size={22} color={COLORS.textMuted} />
                  </TouchableOpacity>
                  <Text style={s.modalTitle}>Combien aujourd'hui ?</Text>
                  <Text style={s.modalSub}>
                    Cigarettes — Sois honnête avec toi-même
                  </Text>
                  <View style={s.quickRow}>
                    {["0", "1", "2", "5", "10"].map((n) => (
                      <TouchableOpacity
                        key={n}
                        style={[s.quickBtn, count === n && s.quickBtnActive]}
                        onPress={() => setCount(n)}
                      >
                        <Text
                          style={[
                            s.quickText,
                            count === n && s.quickTextActive,
                          ]}
                        >
                          {n}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TextInput
                    style={s.modalInput}
                    keyboardType="number-pad"
                    value={count}
                    onChangeText={setCount}
                    placeholder="0"
                    placeholderTextColor="#555"
                    maxLength={3}
                  />
                  <Text style={s.unitLabel}>cigarette(s)</Text>
                  {count !== "" && (
                    <View
                      style={[s.deltaBox, { borderColor: deltaInfo.color }]}
                    >
                      <Ionicons
                        name={deltaInfo.icon}
                        size={24}
                        color={deltaInfo.color}
                      />
                      <Text style={[s.deltaText, { color: deltaInfo.color }]}>
                        {deltaInfo.text}
                      </Text>
                    </View>
                  )}
                  <View style={s.modalBtns}>
                    <TouchableOpacity
                      onPress={() => {
                        setLogModal(false);
                        setCount("");
                      }}
                      style={s.cancelBtn}
                    >
                      <Text style={s.cancelText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={submitLog} style={{ flex: 1 }}>
                      <View style={s.confirmBtn}>
                        <Text style={s.confirmText}>Valider</Text>
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
          <View style={s.trophyOverlay}>
            <View style={s.trophyModal}>
              <Ionicons
                name="trophy"
                size={72}
                color={COLORS.gold}
                style={{ marginBottom: 16 }}
              />
              <Text style={s.trophyLabel}>Trophée débloqué !</Text>
              <Text style={s.trophyName}>{newTrophy.title}</Text>
              <Text style={s.trophyDesc}>{newTrophy.desc}</Text>
              <TouchableOpacity
                onPress={clearNewTrophy}
                style={{ width: "100%" }}
              >
                <View style={s.confirmBtn}>
                  <Text style={s.confirmText}>Super !</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

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
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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
    gap: SPACING.sm,
    flex: 1,
  },
  timerLabel: {
    color: COLORS.gold,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.md,
  },
  scorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  scoreText: {
    color: COLORS.gold,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.sm,
  },
  blockTitle: {
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.base,
  },
  blockSub: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: 2,
  },
  inputGroup: { flexDirection: "row", alignItems: "center", gap: SPACING.xs },
  numInput: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.bgCardBorder,
    color: COLORS.gold,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.xl,
    textAlign: "center",
    width: 52,
    paddingVertical: SPACING.xs,
  },
  confirmSmallBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  remainingCount: {
    fontSize: FONT_SIZE["lg"],
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: 2,
  },
  dailyText: {
    fontSize: FONT_SIZE["4xl"],
    fontWeight: FONT_WEIGHT.black,
  },
  bravoText: {
    color: COLORS.success,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    marginTop: 2,
  },
  glisseeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(156,53,40,0.10)",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  glisseeBtnText: {
    color: COLORS.danger,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.xs,
    lineHeight: 15,
  },
  linkText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    textDecorationLine: "underline",
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
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