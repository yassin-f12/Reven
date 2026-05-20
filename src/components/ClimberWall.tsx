import { COLORS } from "@/src/utils/theme";
import { Avatar } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import useStore from "@/src/store/useStore";
import LevelMarker from "./Levelmarker";
import ClimberAvatar from "./Climberavatar";
import VictoryCard from "./Victorycard";

const { width: SCREEN_W } = Dimensions.get("window");
const TOTAL_STEPS = 30;
const SUMMIT_ZONE = 0.8;
const LEVEL_MILESTONES = [5, 10, 15, 20, 25, 30];

const WALL_IMAGES: Record<number, any> = {
  0: require("@/assets/images/wall.jpeg"),
  5: require("@/assets/images/Wall_4.jpeg"),
  10: require("@/assets/images/Wall_5.jpeg"),
  15: require("@/assets/images/Wall_6.jpeg"),
  20: require("@/assets/images/Wall_7.jpeg"),
  25: require("@/assets/images/Wall_8.jpeg"),
};

function getWallImage(position: number): any {
  if (position >= 25) return WALL_IMAGES[25];
  if (position >= 20) return WALL_IMAGES[20];
  if (position >= 15) return WALL_IMAGES[15];
  if (position >= 10) return WALL_IMAGES[10];
  if (position >= 5) return WALL_IMAGES[5];
  return WALL_IMAGES[0];
}
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
  const animationsSeenForLevels = useStore((s) => s.animationsSeenForLevels);
  const markLevelAnimationSeen = useStore((s) => s.markLevelAnimationSeen);

  const [victoryDismissed, setVictoryDismissed] = useState(false);

  const WALL_W = fullWidth ? SCREEN_W - 40 : 160;
  const WALL_H = fullWidth ? 400 : 500;

  const swayAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const victoryAnim = useRef(new Animated.Value(0)).current;

  const progress = Math.min(position / TOTAL_STEPS, 1);
  const nearSummit = progress >= SUMMIT_ZONE;
  const atSummit = position >= TOTAL_STEPS;
  const climberY = WALL_H * 0.78 - progress * (WALL_H * 0.78 - WALL_H * 0.08);

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
    <View style={[s.container, { marginBottom: 12 }]}>
      <View
        style={[
          s.wall,
          { width: WALL_W, height: WALL_H },
          atSummit && { overflow: "visible" },
        ]}
      >
        <ImageBackground
          source={getWallImage(position)}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <View style={s.overlay} />

        {nearSummit && (
          <Animated.View style={[s.summitGlow, { opacity: glowOpacity }]} />
        )}

        <View style={s.summit}>
          <Ionicons name="flag" size={35} color={COLORS.orange} />
        </View>

        {!atSummit && (
          <ClimberAvatar
            avatar={avatar}
            streak={streak}
            nearSummit={nearSummit}
            swayAnim={swayAnim}
            bounceAnim={bounceAnim}
            climberY={climberY}
          />
        )}

        {atSummit && !victoryDismissed && (
          <VictoryCard
            avatar={avatar}
            addictionLabel={user?.addiction?.label}
            victoryAnim={victoryAnim}
            onDismiss={() => setVictoryDismissed(true)}
            onReset={reset}
          />
        )}

        {!atSummit && (
          <View style={s.posLabel}>
            <Text style={s.posText}>
              {position}/{TOTAL_STEPS}
            </Text>
          </View>
        )}

        <View style={s.progressBar}>
          <View
            style={[
              s.progressFill,
              { height: `${progress * 100}%` },
              nearSummit && s.progressFillNearSummit,
            ]}
          />
        </View>

        {LEVEL_MILESTONES.map((lvl) => (
          <LevelMarker
            key={lvl}
            lvl={lvl}
            position={position}
            wallH={WALL_H}
            alreadySeen={animationsSeenForLevels.includes(lvl)}
            onAnimationPlayed={markLevelAnimationSeen}
          />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
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
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 2,
    zIndex: 10,
    justifyContent: "flex-end",
  },
  progressFill: {
    width: "100%",
    backgroundColor: COLORS.success,
    borderRadius: 2,
  },
  progressFillNearSummit: { backgroundColor: COLORS.gold },
});
