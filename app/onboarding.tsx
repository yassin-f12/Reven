import { ADDICTIONS, AVATARS } from "@/src/data/avatars";
import useStore from "@/src/store/useStore";
import { IoniconsName } from "@/src/utils/icons";
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@/src/utils/theme";
import { Avatar } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const CIGARETTE = ADDICTIONS[0];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [pseudo, setPseudo] = useState("");
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const setUser = useStore((s) => s.setUser);

  const canNext = (): boolean => {
    if (step === 0) return pseudo.trim().length >= 2;
    if (step === 1) return avatar !== null;
    return false;
  };

  const next = () => {
    if (step < 1) {
      setStep(step + 1);
    } else if (avatar) {
      setUser({ pseudo: pseudo.trim(), avatar, addiction: CIGARETTE });
    }
  };

  const stepConfig: { icon: IoniconsName; title: string; sub: string }[] = [
    {
      icon: "game-controller-outline",
      title: "Comment tu t'appelles ?",
      sub: "Ton pseudo de grimpeur",
    },
    {
      icon: "person",
      title: "Choisis ton avatar",
      sub: "Qui va grimper ce mur ?",
    },
  ];

  return (
    <View style={styles.bg}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.logo}>Reven</Text>
            <Text style={styles.tagline}>Grimpe vers ta meilleure version</Text>
          </View>

          <View style={styles.steps}>
            {[0, 1].map((i) => (
              <View
                key={i}
                style={[styles.dot, i <= step && styles.dotActive]}
              />
            ))}
          </View>

          <View style={styles.card}>
            <Ionicons
              name={stepConfig[step].icon}
              size={40}
              color={COLORS.gold}
              style={styles.stepIcon}
            />
            <Text style={styles.stepTitle}>{stepConfig[step].title}</Text>
            <Text style={styles.stepSub}>{stepConfig[step].sub}</Text>

            {step === 0 && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Ex : Angèle"
                  placeholderTextColor="#888"
                  value={pseudo}
                  onChangeText={setPseudo}
                  maxLength={20}
                  autoFocus
                />
                <Text style={styles.charCount}>{pseudo.length}/20</Text>
              </>
            )}

            {step === 1 && (
              <View style={styles.avatarGrid}>
                {AVATARS.map((a) => (
                  <TouchableOpacity
                    key={a.id}
                    style={[
                      styles.avatarBtn,
                      avatar?.id === a.id && styles.avatarBtnActive,
                    ]}
                    onPress={() => setAvatar(a)}
                  >
                    <Image source={a.image} style={{ width: 35, height: 35 }} />
                    <Text style={styles.avatarLabel}>{a.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.btn, !canNext() && styles.btnDisabled]}
            onPress={next}
            disabled={!canNext()}
          >
            <View style={styles.btnInner}>
              <Text style={styles.btnText}>
                {step < 1 ? "Continuer" : "Commencer l'aventure !"}
              </Text>
              <Ionicons
                name={step < 1 ? "arrow-forward" : "checkmark-outline"}
                size={25}
                color={COLORS.bgSecondary}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    padding: SPACING["2xl"],
    paddingTop: 60,
    paddingBottom: SPACING["4xl"],
  },
  header: { alignItems: "center", marginBottom: SPACING["3xl"] },
  logo: {
    fontSize: FONT_SIZE["4xl"],
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.gold,
    letterSpacing: 1,
  },
  tagline: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  steps: {
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.sm,
    marginBottom: SPACING["3xl"] - SPACING.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.tabInactive,
  },
  dotActive: { backgroundColor: COLORS.gold, width: 28 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING["2xl"],
    marginBottom: SPACING["2xl"],
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    alignItems: "center",
  },
  stepIcon: { marginBottom: SPACING.sm },
  stepTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  stepSub: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xl,
    fontSize: FONT_SIZE.md,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    fontWeight: FONT_WEIGHT.semibold,
    width: "100%",
  },
  charCount: {
    color: COLORS.textMuted,
    textAlign: "right",
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    alignSelf: "flex-end",
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm + 2,
    justifyContent: "center",
    width: "100%",
  },
  avatarBtn: {
    width: (width - 100) / 4,
    aspectRatio: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    gap: 4,
  },
  avatarBtnActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldDim,
  },
  avatarLabel: { color: COLORS.textSecondary, fontSize: FONT_SIZE.xs },
  btn: { marginTop: SPACING.sm },
  btnDisabled: { opacity: 0.4 },
  btnInner: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.gold,
  },
  btnText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.bgPrimary,
  },
});
