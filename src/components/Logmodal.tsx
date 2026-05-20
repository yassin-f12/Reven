import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

interface Props {
  visible: boolean;
  count: string;
  onChangeCount: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  deltaInfo: {
    icon: "arrow-up" | "arrow-forward" | "reorder-two-outline" | "arrow-down";
    color: string;
    text: string;
  };
}

export default function LogModal({
  visible,
  count,
  onChangeCount,
  onClose,
  onSubmit,
  deltaInfo,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={s.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
          >
            <TouchableWithoutFeedback>
              <View style={s.modal}>
                <TouchableOpacity onPress={onClose} style={s.closeBtn}>
                  <Ionicons name="close" size={22} color={COLORS.textMuted} />
                </TouchableOpacity>
                <Text style={s.title}>Combien aujourd'hui ?</Text>
                <Text style={s.sub}>
                  Cigarettes — Sois honnête avec toi-même
                </Text>
                <View style={s.quickRow}>
                  {["0", "1", "2", "5", "10"].map((n) => (
                    <TouchableOpacity
                      key={n}
                      style={[s.quickBtn, count === n && s.quickBtnActive]}
                      onPress={() => onChangeCount(n)}
                    >
                      <Text
                        style={[s.quickText, count === n && s.quickTextActive]}
                      >
                        {n}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={s.input}
                  keyboardType="number-pad"
                  value={count}
                  onChangeText={onChangeCount}
                  placeholder="0"
                  placeholderTextColor="#555"
                  maxLength={3}
                />
                <Text style={s.unit}>cigarette(s)</Text>
                {count !== "" && (
                  <View style={[s.deltaBox, { borderColor: deltaInfo.color }]}>
                    <Ionicons
                      name={deltaInfo.icon}
                      size={24}
                      color={deltaInfo.color}
                    />
                    <Text style={[s.deltaText, { color: deltaInfo.color }]}>
                      {deltaInfo.text}
                    </Text>
                  </View>
                )}
                <View style={s.btns}>
                  <TouchableOpacity onPress={onClose} style={s.cancelBtn}>
                    <Text style={s.cancelText}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onSubmit} style={{ flex: 1 }}>
                    <View style={s.confirmBtn}>
                      <Text style={s.confirmText}>Valider</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: COLORS.bgSecondary,
    borderTopLeftRadius: RADIUS["2xl"],
    borderTopRightRadius: RADIUS["2xl"],
    padding: SPACING["2xl"],
    paddingBottom: SPACING["4xl"],
  },
  closeBtn: { alignSelf: "flex-end", marginBottom: SPACING.sm },
  title: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: "900",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  sub: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.md,
    fontSize: FONT_SIZE.md,
  },
  quickRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  quickBtn: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  quickBtnActive: { borderColor: COLORS.gold, backgroundColor: COLORS.goldDim },
  quickText: {
    color: COLORS.textSecondary,
    fontWeight: "700",
    fontSize: FONT_SIZE.lg,
  },
  quickTextActive: { color: COLORS.gold },
  input: {
    fontSize: FONT_SIZE.hero,
    fontWeight: "900",
    color: COLORS.gold,
    textAlign: "center",
    marginBottom: 4,
  },
  unit: {
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: SPACING.md,
    fontSize: FONT_SIZE.base,
  },
  deltaBox: {
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  deltaText: { fontWeight: "800", fontSize: FONT_SIZE.lg },
  btns: { flexDirection: "row", gap: SPACING.md },
  cancelBtn: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgCard,
    alignItems: "center",
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontWeight: "700",
    fontSize: FONT_SIZE.base,
  },
  confirmBtn: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    backgroundColor: COLORS.gold,
  },
  confirmText: {
    color: COLORS.bgSecondary,
    fontWeight: "700",
    fontSize: FONT_SIZE.base,
  },
});
