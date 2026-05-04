import { COLORS } from "@/src/utils/theme";
import { Avatar } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const TOTAL_STEPS = 30;

const HOLDS: { left: string; top: string }[] = [
  { left: "8%", top: "8%" },
  { left: "75%", top: "12%" },
  { left: "40%", top: "20%" },
  { left: "18%", top: "32%" },
  { left: "68%", top: "28%" },
  { left: "50%", top: "40%" },
  { left: "22%", top: "52%" },
  { left: "78%", top: "48%" },
  { left: "35%", top: "62%" },
  { left: "12%", top: "72%" },
  { left: "62%", top: "68%" },
  { left: "45%", top: "80%" },
  { left: "28%", top: "88%" },
  { left: "70%", top: "85%" },
];

interface Props {
  position: number;
  avatar: Avatar | null;
  streak: number;
  fullWidth?: boolean;
}

export default function ClimberWall({
  position,
  avatar,
  streak,
  fullWidth = false,
}: Props) {
  const WALL_W = fullWidth ? SCREEN_W - 40 : 160;
  const WALL_H = fullWidth ? 350 : SCREEN_H * 0.52;

  const swayAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [position]);

  useEffect(() => {
    const sway = Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: 4,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: -4,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    sway.start();
    return () => sway.stop();
  }, []);

  const progress = position / TOTAL_STEPS;
  const climberY = WALL_H - 60 - progress * (WALL_H - 80);
  const coverHeight = (1 - progress) * WALL_H;

  return (
    <View style={[styles.container, { marginBottom: 12 }]}>
      <View style={[styles.wall, { width: WALL_W, height: WALL_H }]}>
        {[...Array(8)].map((_, i) => (
          <View key={i} style={[styles.rockLine, { top: `${i * 13}%` }]} />
        ))}

        {HOLDS.map((h, i) => (
          <View
            key={i}
            style={[styles.hold, { left: h.left as any, top: h.top as any }]}
          />
        ))}

        <View style={[styles.progressZone, { height: coverHeight }]} />

        <View style={styles.summit}>
          <Ionicons name="flag" size={20} color={COLORS.gold} />
          <Text style={styles.summitLabel}>SOMMET</Text>
        </View>

        <Animated.View
          style={[
            styles.climber,
            {
              top: climberY,
              transform: [{ translateX: swayAnim }, { scale: bounceAnim }],
            },
          ]}
        >
          <View style={styles.avatarBubble}>
            <Ionicons
              name={avatar?.iconName ?? "person"}
              size={24}
              color={COLORS.gold}
            />
          </View>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={10} color="#fff" />
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          )}
        </Animated.View>

        <View style={styles.posLabel}>
          <Text style={styles.posText}>
            {position}/{TOTAL_STEPS}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  wall: {
    backgroundColor: COLORS.wallBg,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    borderWidth: 3,
    borderColor: COLORS.wallBorder,
    elevation: 10,
  },
  rockLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  hold: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    transform: [{ translateX: -7 }, { translateY: -7 }],
  },
  progressZone: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.wallOverlay,
  },
  summit: {
    position: "absolute",
    top: 6,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  summitLabel: {
    color: COLORS.gold,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 1,
  },
  climber: {
    position: "absolute",
    left: "50%",
    marginLeft: -22,
    alignItems: "center",
    zIndex: 10,
  },
  avatarBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  streakBadge: {
    position: "absolute",
    top: -8,
    right: -14,
    backgroundColor: "#ff4500",
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  streakText: { color: "#fff", fontSize: 9, fontWeight: "900" },
  posLabel: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  posText: { color: COLORS.gold, fontSize: 10, fontWeight: "700" },
});
