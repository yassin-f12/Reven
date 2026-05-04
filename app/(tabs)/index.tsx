import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ClimberWall from "@/src/components/ClimberWall";
import DayTracker from "@/src/components/DayTracker";
import motivationsData from "@/src/data/motivations.json";
import useStore from "@/src/store/useStore";
import { getDeltaInfo } from "@/src/utils/calculations";
import {
  COLORS,
  FONT_SIZE,
  RADIUS,
  SPACING,
} from "@/src/utils/theme";

export default function HomeScreen() {
  const user = useStore((s) => s.user);
  const position = useStore((s) => s.position);
  const streak = useStore((s) => s.streak);
  const logs = useStore((s) => s.logs);
  const newTrophy = useStore((s) => s.newTrophy);
  const clearNewTrophy = useStore((s) => s.clearNewTrophy);
  const logDay = useStore((s) => s.logDay);
  const todayLog = useStore((s) => s.todayLog);
  const dayNumber = useStore((s) => s.dayNumber);

  const insets = useSafeAreaInsets();
  const [logModal, setLogModal] = useState(false);
  const [count, setCount] = useState("");
  const [motivation] = useState(() => {
    const list = motivationsData.motivations;
    return list[Math.floor(Math.random() * list.length)];
  });

  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.flashScrollIndicators();
    }, []),
  );

  const submitLog = () => {
    const num = parseInt(count) || 0;
    logDay(num);
    setLogModal(false);
    setCount("");
    Keyboard.dismiss();
  };

  const deltaInfo = getDeltaInfo(parseInt(count) || 0);

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
          <View>
            <Text style={styles.greeting}>Salut, {user?.pseudo}</Text>
            <Text style={styles.subGreeting}>
              Jour {dayNumber}/30 • {user?.addiction?.label}
            </Text>
          </View>
          <View style={styles.streakPill}>
            <Ionicons name="flame" size={14} color="#ff6a00" />
            <Text style={styles.streakText}> {streak} jours</Text>
          </View>
        </View>

        <View style={styles.motivationBox}>
          <Ionicons
            name="sparkles"
            size={14}
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

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={16} color={COLORS.textPrimary} />
            <Text style={styles.statValue}>
              {Math.round((position / 30) * 100)}%
            </Text>
            <Text style={styles.statLabel}>Progression</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="triangle" size={16} color={COLORS.success} />
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              {position}/30
            </Text>
            <Text style={styles.statLabel}>Position</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={COLORS.textPrimary}
            />
            <Text style={styles.statValue}>{30 - dayNumber}</Text>
            <Text style={styles.statLabel}>Restants</Text>
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
                color={COLORS.success}
              />
              <Text style={styles.loggedText}>
                {" "}
                Loggé : {todayLog.count} {user?.addiction?.unit}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setLogModal(true)}>
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
                    {user?.addiction?.label} — Sois honnête avec toi-même
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
                      <Text
                        style={[styles.deltaText, { color: deltaInfo.color }]}
                      >
                        {deltaInfo.text}
                      </Text>
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
    backgroundColor: "rgba(255,69,0,0.2)",
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,69,0,0.4)",
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: { color: "#ff6a00", fontWeight: "800", fontSize: FONT_SIZE.md },
  motivationBox: {
    backgroundColor: COLORS.goldDim,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
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
  },
  logBtnText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
    color: COLORS.bgSecondary,
  },
  loggedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.successDim,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  loggedLeft: { flexDirection: "row", alignItems: "center" },
  loggedText: {
    color: COLORS.success,
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
    backgroundColor: "#1e1e3f",
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
  },
  confirmText: {
    color: COLORS.bgSecondary,
    fontWeight: "900",
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
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  trophyLabel: {
    color: COLORS.gold,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  trophyName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE["3xl"],
    fontWeight: "900",
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  trophyDesc: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.base,
    textAlign: "center",
    marginBottom: SPACING["2xl"],
  },
});
