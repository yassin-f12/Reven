import React, { useState, useEffect } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
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

interface Props {
  dailyCount: number;
  onSetObjectif: (val: number) => void;
  onDecrement: () => void;
}

export default function ObjectifBlock({
  dailyCount,
  onSetObjectif,
  onDecrement,
}: Props) {
  const [input, setInput] = useState("");
  const [hasObjectif, setHasObjectif] = useState(dailyCount > 0);

  const submit = () => {
    const val = parseInt(input);
    if (isNaN(val) || val < 0) return;
    onSetObjectif(val);
    setHasObjectif(true);
    Keyboard.dismiss();
  };

  const remainingColor =
    dailyCount === 0
      ? COLORS.success
      : dailyCount <= 2
        ? COLORS.warning
        : COLORS.textPrimary;

  return (
    <View style={s.card}>
      {!hasObjectif ? (
        <View style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={s.blockTitle}>
              Objectif du jour{" "}
              <Ionicons name="golf" size={16} color={COLORS.gold} />
            </Text>
            <Text style={s.blockSub}>{"Aujourd'hui je compte fumer :"}</Text>
          </View>
          <View style={s.inputGroup}>
            <TextInput
              style={s.numInput}
              keyboardType="number-pad"
              value={input}
              onChangeText={setInput}
              placeholder="0"
              placeholderTextColor={COLORS.textMuted}
              maxLength={2}
              returnKeyType="done"
              onSubmitEditing={submit}
            />
            <TouchableOpacity
              style={[s.confirmBtn, !input && { opacity: 0.4 }]}
              onPress={submit}
              disabled={!input}
            >
              <Ionicons name="checkmark" size={18} color={COLORS.bgPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={s.row}>
          <View style={{ flex: 1, gap: 10 }}>
            <Text style={s.blockTitle}>
              Objectif du jour{" "}
              <Ionicons name="golf" size={16} color={COLORS.gold} />
            </Text>
            <Text style={[s.remaining, { color: remainingColor }]}>
              <Text style={[s.remainingBig, { color: remainingColor }]}>
                {dailyCount}
              </Text>{" "}
              {"restante"}
              {dailyCount !== 1 ? "s" : ""}
            </Text>
            {dailyCount === 0 && (
              <View style={s.bravoRow}>
                <Ionicons name="flame" size={16} color={COLORS.gold} />
                <Text style={s.bravo}>Objectif atteint !</Text>
              </View>
            )}
          </View>
          <View style={{ alignItems: "center", gap: 15 }}>
            <TouchableOpacity
              style={[s.glisseeBtn, dailyCount === 0 && { opacity: 0.3 }]}
              onPress={onDecrement}
              disabled={dailyCount === 0}
            >
              <Ionicons name="hand-left" size={15} color={COLORS.danger} />
              <Text style={s.glisseeBtnText}>{"Ma main\na glissé"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setHasObjectif(false);
                setInput(String(dailyCount));
              }}
            >
              <Text style={s.link}>Modifier</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
  },
  row: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  blockTitle: {
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.base,
  },
  blockSub: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: 2,
  },
  inputGroup: { flexDirection: "row", alignItems: "center", gap: SPACING.xs },
  numInput: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.bgCardBorder,
    color: COLORS.gold,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.xl,
    textAlign: "center",
    width: 52,
    paddingVertical: SPACING.xs,
  },
  confirmBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  remaining: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: 2,
  },
  remainingBig: { fontSize: FONT_SIZE["4xl"], fontWeight: FONT_WEIGHT.black },
  bravoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  bravo: {
    color: COLORS.success,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  glisseeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(156,53,40,0.10)",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  glisseeBtnText: {
    color: COLORS.danger,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.xs,
    lineHeight: 15,
  },
  link: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
