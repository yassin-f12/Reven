import { COLORS } from "@/src/utils/theme";
import { Avatar } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  avatar: Avatar | null;
  addictionLabel: string | undefined;
  victoryAnim: Animated.Value;
  onDismiss: () => void;
  onReset: () => void;
}

export default function VictoryCard({
  avatar,
  addictionLabel,
  victoryAnim,
  onDismiss,
  onReset,
}: Props) {
  return (
    <Animated.View
      style={[
        s.overlay,
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
      <View style={s.card}>
        <TouchableOpacity onPress={onDismiss} style={s.close}>
          <Ionicons name="close" size={22} color={COLORS.textMuted} />
        </TouchableOpacity>
        <Ionicons name="trophy" size={48} color={COLORS.gold} />
        <Text style={s.title}>Sommet atteint !</Text>
        <Image source={avatar?.image} style={s.avatar} />
        <Text style={s.addiction}>
          30 jours pour arrêter : {addictionLabel?.toLowerCase()}
        </Text>
        <Text style={s.sub}>Tu l'as fait. Pour de vrai.</Text>
        <TouchableOpacity onPress={onReset} style={s.restartBtn}>
          <Ionicons name="refresh" size={16} color={COLORS.bgSecondary} />
          <Text style={s.restartBtnText}>Recommencer à 0</Text>
        </TouchableOpacity>
        <Text style={s.restartSub}>Parce qu'on n'arrête jamais de grimper</Text>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    alignItems: "center",
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 24,
    padding: 28,
    borderColor: COLORS.goldBorder,
    width: "100%",
    gap: 8,
  },
  close: { position: "absolute", top: 8, right: 8 },
  title: {
    color: COLORS.gold,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },
  avatar: { width: 64, height: 64, marginVertical: 4 },
  addiction: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  sub: {
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
