import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Trophy } from "@/types";
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@/src/utils/theme";

interface Props {
  trophy: Trophy | null;
  onClose: () => void;
}

export default function TrophyModal({ trophy, onClose }: Props) {
  if (!trophy) return null;
  return (
    <Modal visible transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.modal}>
          <Ionicons
            name="trophy"
            size={72}
            color={COLORS.gold}
            style={{ marginBottom: 16 }}
          />
          <Text style={s.label}>Trophée débloqué !</Text>
          <Text style={s.name}>{trophy.title}</Text>
          <Text style={s.desc}>{trophy.desc}</Text>
          <TouchableOpacity onPress={onClose} style={{ width: "100%" }}>
            <View style={s.btn}>
              <Text style={s.btnText}>Super !</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING["3xl"],
  },
  modal: {
    borderRadius: RADIUS["2xl"],
    padding: SPACING["3xl"],
    alignItems: "center",
    width: "100%",
  },
  label: {
    color: COLORS.gold,
    fontSize: FONT_SIZE["2xl"],
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  name: {
    color: COLORS.gold,
    fontSize: FONT_SIZE["3xl"],
    fontWeight: FONT_WEIGHT.black,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  desc: {
    color: COLORS.gold,
    fontSize: FONT_SIZE.base,
    textAlign: "center",
    marginBottom: SPACING["2xl"],
  },
  btn: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    backgroundColor: COLORS.gold,
  },
  btnText: {
    color: COLORS.bgSecondary,
    fontWeight: "700",
    fontSize: FONT_SIZE.base,
  },
});
