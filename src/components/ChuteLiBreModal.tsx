import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
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

const BREATHING_STEPS = [
  "Inspire lentement par le nez... (4 secondes)",
  "Bloque ta respiration... (4 secondes)",
  "Expire doucement par la bouche... (6 secondes)",
  "Recommence. Tu tiens le coup.",
];

const CRAVING_TIPS = [
  "Le craving dure en moyenne 3 à 5 minutes. Tu peux tenir.",
  "Une envie n'est pas un ordre.",
  "Bois un grand verre d'eau maintenant.",
  "Lève-toi et marche 2 minutes.",
  "Change de pièce maintenant.",
  "Appelle quelqu'un que tu aimes.",
  "Mets de l'eau froide sur ton visage.",
  "Serre les poings 10 secondes, puis relâche.",
  "Regarde une photo qui te rend heureux(se).",
  "Le manque est une vague - laisse-la passer.",
  "Ça va redescendre, même si c'est fort maintenant.",
  "Tu as déjà résisté avant. Tu peux le faire encore.",
  "Chaque minute de résistance compte.",
  "Compte lentement jusqu'à 60.",
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
    const interval = setInterval(() => {
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
    return () => clearInterval(interval);
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
    const interval = setInterval(
      () => setBreathIndex((n) => (n + 1) % BREATHING_STEPS.length),
      4000,
    );
    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    setProgress(100);

    const duration = 180000;
    const intervalTime = 1000;

    const step = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p - step;
        return next <= 0 ? 0 : next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={COLORS.textMuted} />
          </TouchableOpacity>

          <Text style={styles.title}>
            Mode résistance{" "}
            <Ionicons name="shield" size={20} color={COLORS.textPrimary} />
          </Text>
          <Text style={styles.sub}>
            Tu ressens l'envie de fumer ?{"\n"}Reste là. Je suis avec toi
          </Text>

          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${progress}%`,
                  backgroundColor:
                    progress > 60
                      ? COLORS.danger
                      : progress > 30
                        ? COLORS.orange
                        : COLORS.success,
                },
              ]}
            />
          </View>

          <Text style={styles.encouragement}>
            {progress > 60
              ? "Respire. Ça monte, mais ça va redescendre..."
              : progress > 30
                ? "Ça commence à passer"
                : "Tu es presque sorti de la vague"}
          </Text>

          <Animated.View
            style={[styles.avatarWrap, { transform: [{ scale: scaleAnim }] }]}
          >
            <Image source={avatar} style={styles.avatar} />
          </Animated.View>

          <View style={styles.breathBox}>
            <Ionicons
              name="chatbubble-ellipses"
              size={18}
              color={COLORS.info}
            />
            <Text style={styles.breathStep}>
              {BREATHING_STEPS[breathIndex]}
            </Text>
          </View>

          <Animated.View style={[styles.tipBox, { opacity: fadeAnim }]}>
            <Ionicons name="bulb" size={16} color={COLORS.gold} />
            <Text style={styles.tip}>{CRAVING_TIPS[tipIndex]}</Text>
          </Animated.View>

          <Text style={styles.encouragement}>
            Le craving passe. Toi, tu restes.
          </Text>

          <TouchableOpacity onPress={onClose} style={styles.doneBtn}>
            <Text style={styles.doneBtnText}>
              J'ai tenu{" "}
              <Ionicons name="fitness" size={20} color={COLORS.bgPrimary} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.82)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING["2xl"],
  },
  card: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: RADIUS["2xl"],
    padding: SPACING["2xl"],
    width: "100%",
    alignItems: "center",
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
  },
  closeBtn: { alignSelf: "flex-end" },
  title: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textPrimary,
    textAlign: "center",
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
    marginTop: SPACING.sm,
  },
  progressBar: {
    height: "100%",
    borderRadius: 10,
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.goldDim,
    marginVertical: SPACING.sm,
  },
  avatar: { width: 54, height: 54 },
  breathBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: "rgba(58,107,122,0.15)",
    borderRadius: RADIUS.md,
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
    alignItems: "flex-start",
    gap: SPACING.sm,
    backgroundColor: COLORS.goldDim,
    borderRadius: RADIUS.md,
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
  doneBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
    width: "100%",
    alignItems: "center",
  },
  doneBtnText: {
    color: COLORS.bgPrimary,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.lg,
  },
});
