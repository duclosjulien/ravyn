import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { colors, radii, spacing, typography } from "../theme";

export function Composer() {
  return (
    <View style={styles.composer}>
      <TextInput
        accessibilityLabel="Message"
        editable={false}
        placeholder="Write something…"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />
      <Pressable
        accessibilityLabel="Send message"
        accessibilityRole="button"
        style={styles.sendButton}
      >
        <Ionicons color={colors.onAction} name="send" size={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    alignItems: "center",
    backgroundColor: colors.appSurface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.sm
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontFamily: typography.body,
    fontSize: 15,
    minHeight: 44,
    paddingHorizontal: spacing.md
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.action,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44
  }
});
