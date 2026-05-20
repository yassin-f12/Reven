import { COLORS } from "@/src/utils/theme";
import { Avatar } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

interface Props {
  avatar: Avatar | null;
  streak: number;
  nearSummit: boolean;
  swayAnim: Animated.Value;
  bounceAnim: Animated.Value;
  climberY: number;
}

export default function ClimberAvatar({
  avatar,
  streak,
  nearSummit,
  swayAnim,
  bounceAnim,
  climberY,
}: Props) {
  return (
    <Animated.View
      style={[
        s.climber,
        {
          top: climberY,
          transform: [{ translateX: swayAnim }, { scale: bounceAnim }],
        },
      ]}
    >
      {nearSummit && (
        <Text style={s.nearSummitBadge}>Courage, tu y es presque !</Text>
      )}
      <View style={[s.avatarBubble, nearSummit && s.avatarBubbleNearSummit]}>
        <Image source={avatar?.image} style={{ width: 35, height: 35 }} />
      </View>
      {streak > 0 && (
        <View style={s.streakBadge}>
          <Ionicons name="flame" size={10} color="#fff" />
          <Text style={s.streakText}>{streak}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const s = StyleSheet.create({
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
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  streakText: { color: "#fff", fontSize: 9, fontWeight: "900" },
});
