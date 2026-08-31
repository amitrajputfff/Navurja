import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labels?: Partial<Record<T, string>>;
}) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
              {labels?.[option] ?? option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#e2e2e2",
  },
  segmentActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  segmentText: { fontSize: 13, fontWeight: "600", color: colors.darkText, textTransform: "capitalize" },
  segmentTextActive: { color: colors.white },
});
