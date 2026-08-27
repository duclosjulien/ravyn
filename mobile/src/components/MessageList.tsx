import { FlatList, StyleSheet, Text } from "react-native";

import { colors, spacing, typography } from "../theme";
import type { MessagePreview } from "../types/appShell";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  dateLabel: string;
  messages: MessagePreview[];
}

export function MessageList({ dateLabel, messages }: MessageListProps) {
  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={messages}
      keyExtractor={message => message.id}
      ListEmptyComponent={<Text style={styles.empty}>No messages yet.</Text>}
      ListHeaderComponent={
        messages.length > 0 ? <Text style={styles.date}>{dateLabel}</Text> : null
      }
      renderItem={({ item }) => <MessageBubble message={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    gap: spacing.sm,
    padding: spacing.md
  },
  date: {
    color: colors.textSubtle,
    fontFamily: typography.body,
    fontSize: 11,
    marginBottom: spacing.sm,
    textAlign: "center"
  },
  empty: {
    color: colors.textSubtle,
    fontFamily: typography.body,
    fontSize: 14,
    paddingVertical: spacing.xl,
    textAlign: "center"
  }
});
