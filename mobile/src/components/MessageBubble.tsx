import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../theme";
import type { MessagePreview } from "../types/appShell";

interface MessageBubbleProps {
  message: MessagePreview;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutgoing = message.direction === "outgoing";
  const directionLabel = isOutgoing ? "Outgoing" : "Incoming";

  return (
    <View
      accessible
      accessibilityLabel={`${directionLabel} message. ${message.content}. ${message.timestamp}`}
      style={[styles.row, isOutgoing && styles.rowOutgoing]}
    >
      <View style={[styles.bubble, isOutgoing ? styles.outgoing : styles.incoming]}>
        <Text style={[styles.content, isOutgoing && styles.contentOutgoing]}>
          {message.content}
        </Text>
        <Text style={[styles.timestamp, isOutgoing && styles.timestampOutgoing]}>
          {message.timestamp}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "flex-start"
  },
  rowOutgoing: {
    alignItems: "flex-end"
  },
  bubble: {
    borderRadius: radii.md,
    maxWidth: "82%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  incoming: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1
  },
  outgoing: {
    backgroundColor: colors.action
  },
  content: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 21
  },
  contentOutgoing: {
    color: colors.onAction
  },
  timestamp: {
    alignSelf: "flex-end",
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 11,
    marginTop: spacing.xs
  },
  timestampOutgoing: {
    color: colors.onAction
  }
});
