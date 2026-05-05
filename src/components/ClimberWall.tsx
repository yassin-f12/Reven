import { COLORS } from "@/src/utils/theme";
import { Avatar } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useStore from "@/src/store/useStore";

const { width: SCREEN_W } = Dimensions.get("window");
const TOTAL_STEPS = 30;
const SUMMIT_ZONE = 0.8;

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
  const reset = useStore((s) => s.reset);
  const user = useStore((s) => s.user);

  const WALL_W = fullWidth ? SCREEN_W - 40 : 160;
  const WALL_H = fullWidth ? 400 : 500;

  const swayAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const victoryAnim = useRef(new Animated.Value(0)).current;

  const progress = Math.min(position / TOTAL_STEPS, 1);
  const nearSummit = progress >= SUMMIT_ZONE;
  const atSummit = position >= TOTAL_STEPS;

  const TOP_Y = WALL_H * 0.08;
  const BOTTOM_Y = WALL_H * 0.78;
  const climberY = BOTTOM_Y - progress * (BOTTOM_Y - TOP_Y);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.15,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [position]);

  useEffect(() => {
    const sway = Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: 3,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: -3,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    sway.start();
    return () => sway.stop();
  }, []);

  useEffect(() => {
    if (!nearSummit) return;
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    glow.start();
    return () => glow.stop();
  }, [nearSummit]);

  useEffect(() => {
    if (!atSummit) return;
    Animated.spring(victoryAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [atSummit]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  return (
    <View style={[styles.container, { marginBottom: 12 }]}>
      <View style={[styles.wall, { width: WALL_W, height: WALL_H }]}>
        <ImageBackground
          source={require("@/assets/images/wall.jpeg")}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        <View style={styles.overlay} />

        {nearSummit && (
          <Animated.View
            style={[styles.summitGlow, { opacity: glowOpacity }]}
          />
        )}

        <View style={styles.summit}>
          <Ionicons name="flag" size={35} color={COLORS.orange} />
        </View>

        {!atSummit && (
          <Animated.View
            style={[
              styles.climber,
              {
                top: climberY,
                transform: [{ translateX: swayAnim }, { scale: bounceAnim }],
              },
            ]}
          >
            {nearSummit && (
              <Text style={styles.nearSummitBadge}>Courage, tu y es presque !</Text>
            )}
            <View
              style={[
                styles.avatarBubble,
                nearSummit && styles.avatarBubbleNearSummit,
              ]}
            >
              <Image source={avatar?.image} style={{ width: 35, height: 35 }} />
            </View>
            {streak > 0 && (
              <View style={styles.streakBadge}>
                <Ionicons name="flame" size={10} color="#fff" />
                <Text style={styles.streakText}>{streak}</Text>
              </View>
            )}
          </Animated.View>
        )}

        {atSummit && (
          <Animated.View
            style={[
              styles.victoryOverlay,
              {
                opacity: victoryAnim,
                transform: [
                  {
                    scale: victoryAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.victoryCard}>
              <Ionicons name="trophy" size={48} color={COLORS.gold} />
              <Text style={styles.victoryTitle}>Sommet atteint !</Text>
              <Image source={avatar?.image} style={styles.victoryAvatar} />
              <Text style={styles.victoryAddiction}>
                30 jours sans {user?.addiction?.label?.toLowerCase()}
              </Text>
              <Text style={styles.victorySub}>Tu l'as fait. Pour de vrai.</Text>

              <TouchableOpacity onPress={reset} style={styles.restartBtn}>
                <Ionicons name="refresh" size={16} color={COLORS.bgSecondary} />
                <Text style={styles.restartBtnText}>Recommencer à 0</Text>
              </TouchableOpacity>
              <Text style={styles.restartSub}>
                Parce qu'on n'arrête jamais de grimper
              </Text>
            </View>
          </Animated.View>
        )}

        {!atSummit && (
          <View style={styles.posLabel}>
            <Text style={styles.posText}>
              {position}/{TOTAL_STEPS}
            </Text>
          </View>
        )}

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { height: `${progress * 100}%` },
              nearSummit && styles.progressFillNearSummit,
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  wall: {
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: COLORS.wallBorder,
    elevation: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 1,
  },
  summitGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30%",
    backgroundColor: COLORS.gold,
    zIndex: 2,
  },
  summit: {
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  climber: {
    position: "absolute",
    left: "50%",
    marginLeft: -22,
    alignItems: "center",
    zIndex: 10,
  },
  nearSummitBadge: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: "900",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
    overflow: "hidden",
  },
  avatarBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBubbleNearSummit: {
    borderColor: "#ffd700",
    backgroundColor: "rgba(255,215,0,0.2)",
    borderWidth: 3,
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
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 10,
  },
  posText: { color: COLORS.gold, fontSize: 10, fontWeight: "700" },
  progressBar: {
    position: "absolute",
    left: 8,
    bottom: 8,
    top: 8,
    width: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 2,
    zIndex: 10,
    justifyContent: "flex-end",
  },
  progressFill: {
    width: "100%",
    backgroundColor: COLORS.success,
    borderRadius: 2,
  },
  progressFillNearSummit: {
    backgroundColor: COLORS.gold,
  },

  victoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    padding: 20,
  },
  victoryCard: {
    alignItems: "center",
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 24,
    padding: 28,
    borderColor: COLORS.goldBorder,
    width: "100%",
    gap: 8,
  },
  victoryTitle: {
    color: COLORS.gold,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },
  victoryAvatar: {
    width: 64,
    height: 64,
    marginVertical: 4,
  },
  victoryAddiction: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  victorySub: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
  },
  restartBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.gold,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 4,
  },
  restartBtnText: {
    color: COLORS.bgSecondary,
    fontWeight: "900",
    fontSize: 15,
  },
  restartSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 4,
  },
});
