import { COLORS } from "@/src/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

const TOTAL_STEPS = 30;

interface Props {
  lvl: number;
  position: number;
  wallH: number;
  alreadySeen: boolean;
  onAnimationPlayed: (lvl: number) => void;
}

export default function LevelMarker({
  lvl,
  position,
  wallH,
  alreadySeen,
  onAnimationPlayed,
}: Props) {
  const reached = position >= lvl;
  const prevReached = useRef(alreadySeen);
  const scaleAnim = useRef(
    new Animated.Value(alreadySeen && reached ? 1.4 : 1),
  ).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reached && !prevReached.current && !alreadySeen) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 2.2,
          tension: 80,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.4,
          tension: 60,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(3)),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0.5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 4 },
      ).start();
      onAnimationPlayed(lvl);
    }
    if (reached) {
      prevReached.current = true;
    } else {
      prevReached.current = false;
      scaleAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [reached]);

  const pct = lvl / TOTAL_STEPS;
  const topPos = 8 + (1 - pct) * (wallH - 16);
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "30deg"],
  });
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.9],
  });

  return (
    <View style={[s.wrap, { top: topPos - 7 }]}>
      {reached && <Animated.View style={[s.glow, { opacity: glowOpacity }]} />}
      <Animated.View
        style={[s.inner, { transform: [{ scale: scaleAnim }, { rotate }] }]}
      >
        <Ionicons
          name="flag"
          size={10}
          color={reached ? COLORS.gold : "rgba(255,255,255,1)"}
        />
      </Animated.View>
      <Text style={[s.label, reached && s.labelReached]}>{lvl}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    zIndex: 11,
  },
  inner: { alignItems: "center", justifyContent: "center" },
  glow: {
    position: "absolute",
    left: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.gold,
  },
  label: { color: "rgba(255,255,255,1)", fontSize: 7, fontWeight: "900" },
  labelReached: { color: COLORS.gold },
});
