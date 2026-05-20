import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@/src/utils/theme";
import EvasionGame from "./Evasiongame";

const BREATHING_STEPS = [
  "Inspire lentement par le nez... (4 secondes)",
  "Bloque ta respiration... (4 secondes)",
  "Expire doucement par la bouche... (6 secondes)",
  "Recommence. Tu tiens le coup",
];

const CRAVING_TIPS = [
  "Le craving dure en moyenne 3 à 5 minutes. Tu peux tenir",
  "Une envie n'est pas un ordre",
  "Bois un grand verre d'eau maintenant",
  "Lève-toi et marche 2 minutes",
  "Change de pièce maintenant",
  "Appelle quelqu'un que tu aimes",
  "Mets de l'eau froide sur ton visage",
  "Serre les poings 10 secondes, puis relâche",
  "Regarde une photo qui te rend heureux(se)",
  "Le manque est une vague - laisse-la passer",
  "Ça va redescendre, même si c'est fort maintenant",
  "Tu as déjà résisté avant. Tu peux le faire encore",
  "Chaque minute de résistance compte",
  "Compte lentement jusqu'à 60",
];
interface Props {
  visible: boolean;
  onClose: () => void;
  avatar: any;
}

export default function ChuteLiBreModal({ visible, onClose, avatar }: Props) {
  const [tipIndex, setTipIndex] = useState(0);
  const [breathIndex, setBreathIndex] = useState(0);
  const [progress, setProgress] = useState(100);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;
    const i = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      setTimeout(() => setTipIndex((n) => (n + 1) % CRAVING_TIPS.length), 300);
    }, 4000);
    return () => clearInterval(i);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.12,
          duration: 4000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const i = setInterval(
      () => setBreathIndex((n) => (n + 1) % BREATHING_STEPS.length),
      4000,
    );
    return () => clearInterval(i);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    setProgress(100);
    const step = 100 / 180;
    const i = setInterval(
      () => setProgress((p) => Math.max(0, p - step)),
      1000,
    );
    return () => clearInterval(i);
  }, [visible]);

  const progressColor =
    progress > 60
      ? COLORS.danger
      : progress > 30
        ? COLORS.orange
        : COLORS.success;

  const progressMsg =
    progress > 60
      ? "Respire. Ça monte, mais ça va redescendre..."
      : progress > 30
        ? "Ça commence à passer..."
        : "Tu es presque sorti de la vague";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={m.overlay}>
        <View style={m.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={m.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={m.topRow}>
              <Text style={m.title}>
                Mode résistance{" "}
                <Ionicons name="shield" size={20} color={COLORS.textPrimary} />
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={22} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={m.sub}>
              Tu ressens l'envie de fumer ?{"\n"}Reste là. Je suis avec toi.
            </Text>

            <View style={m.progressContainer}>
              <View
                style={[
                  m.progressBar,
                  { width: `${progress}%`, backgroundColor: progressColor },
                ]}
              />
            </View>
            <Text style={m.encouragement}>{progressMsg}</Text>

            <Animated.View
              style={[m.avatarWrap, { transform: [{ scale: scaleAnim }] }]}
            >
              <Image source={avatar} style={m.avatar} />
            </Animated.View>

            <View style={m.breathBox}>
              <Ionicons
                name="chatbubble-ellipses"
                size={18}
                color={COLORS.info}
              />
              <Text style={m.breathStep}>{BREATHING_STEPS[breathIndex]}</Text>
            </View>

            <Animated.View style={[m.tipBox, { opacity: fadeAnim }]}>
              <Ionicons name="bulb" size={16} color={COLORS.gold} />
              <Text style={m.tip}>{CRAVING_TIPS[tipIndex]}</Text>
            </Animated.View>

            <Text style={m.encouragement}>
              Le craving passe. Toi, tu restes.
            </Text>

            <View style={m.gameSep}>
              <View style={m.gameSepLine} />
              <Text style={m.gameSepText}>occupe-toi les mains</Text>
              <View style={m.gameSepLine} />
            </View>

            <EvasionGame />

            <TouchableOpacity onPress={onClose} style={m.doneBtn}>
              <View style={m.doneBtnInner}>
                <Text style={m.doneBtnText}>J'ai tenu</Text>
                <Ionicons name="fitness" size={20} color={COLORS.bgPrimary} />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const m = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.82)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.bgSecondary,
    borderTopLeftRadius: RADIUS["2xl"],
    borderTopRightRadius: RADIUS["2xl"],
    maxHeight: "92%",
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
  },
  scrollContent: {
    padding: SPACING["2xl"],
    gap: SPACING.md,
    paddingBottom: SPACING["4xl"],
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textPrimary,
  },
  sub: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    textAlign: "center",
    lineHeight: 20,
  },
  progressContainer: {
    width: "100%",
    height: 10,
    backgroundColor: COLORS.goldDim,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: { height: "100%", borderRadius: 10 },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.goldDim,
    alignSelf: "center",
  },
  avatar: { width: 54, height: 54 },
  breathBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    width: "100%",
  },
  breathStep: {
    color: COLORS.info,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.md,
    flex: 1,
    lineHeight: 20,
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    width: "100%",
  },
  tip: {
    color: COLORS.gold,
    fontSize: FONT_SIZE.md,
    flex: 1,
    lineHeight: 20,
    fontWeight: FONT_WEIGHT.semibold,
  },
  encouragement: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    fontStyle: "italic",
    textAlign: "center",
  },
  gameSep: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginVertical: SPACING.sm,
  },
  gameSepLine: { flex: 1, height: 1, backgroundColor: COLORS.bgCardBorder },
  gameSepText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontStyle: "italic",
  },
  doneBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  doneBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  doneBtnText: {
    color: COLORS.bgPrimary,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.lg,
  },
});
