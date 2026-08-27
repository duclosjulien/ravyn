import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../theme";
import type { ConversationPreview } from "../types/appShell";
import { Avatar } from "./Avatar";

interface ConversationRowProps {
  conversation: ConversationPreview;
  onPress: () => void;
}

export function ConversationRow({ conversation, onPress }: ConversationRowProps) {
  return (
    <Pressable
      accessibilityLabel={`${conversation.displayName}, ${conversation.excerpt}, ${conversation.timestamp}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Avatar initials={conversation.initials} />
      <View style={styles.copy}>
        <View style={styles.heading}>
          <Text numberOfLines={1} style={styles.name}>
            {conversation.displayName}
          </Text>
          <Text style={styles.timestamp}>{conversation.timestamp}</Text>
        </View>
        <Text numberOfLines={2} style={styles.excerpt}>
          {conversation.excerpt}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 84,
    paddingVertical: spacing.md
  },
  rowPressed: {
    opacity: 0.72
  },
  copy: {
    flex: 1
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  name: {
    color: colors.text,
    flex: 1,
    fontFamily: typography.heading,
    fontSize: 18
  },
  timestamp: {
    color: colors.textSubtle,
    fontFamily: typography.body,
    fontSize: 12
  },
  excerpt: {
    color: colors.textSubtle,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs
  }
});
