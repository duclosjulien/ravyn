import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../theme";
import type { ConnectionPreview } from "../types/appShell";
import { Avatar } from "./Avatar";

interface ConnectionRowProps {
  connection: ConnectionPreview;
}

export function ConnectionRow({ connection }: ConnectionRowProps) {
  return (
    <View style={styles.row}>
      <Avatar initials={connection.initials} />
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.name}>
          {connection.displayName}
        </Text>
        <Text numberOfLines={1} style={styles.supportingText}>
          {connection.supportingText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 76,
    padding: spacing.md
  },
  copy: {
    flex: 1
  },
  name: {
    color: colors.text,
    fontFamily: typography.heading,
    fontSize: 17
  },
  supportingText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
    marginTop: spacing.xs
  }
});
