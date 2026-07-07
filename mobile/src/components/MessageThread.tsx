import { FlatList, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/theme";
import { Message } from "@/types/chat";

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageThread({ messages, currentUserId }: MessageThreadProps) {
  return (
    <FlatList
      data={messages}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const isOutgoing = item.senderId === currentUserId;

        return (
          <View
            style={[
              styles.messageRow,
              isOutgoing ? styles.messageRowOutgoing : styles.messageRowIncoming
            ]}
          >
            <View
              style={[
                styles.bubble,
                isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isOutgoing && styles.messageTextOutgoing
                ]}
              >
                {item.content}
              </Text>
              <Text
                style={[styles.time, isOutgoing && styles.timeOutgoing]}
              >
                {item.createdAtLabel}
              </Text>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
    padding: spacing.md
  },
  messageRow: {
    flexDirection: "row"
  },
  messageRowIncoming: {
    justifyContent: "flex-start"
  },
  messageRowOutgoing: {
    justifyContent: "flex-end"
  },
  bubble: {
    borderRadius: 16,
    maxWidth: "82%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  bubbleIncoming: {
    backgroundColor: colors.softSurface
  },
  bubbleOutgoing: {
    backgroundColor: colors.action
  },
  messageText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21
  },
  messageTextOutgoing: {
    color: colors.onAction
  },
  time: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 5
  },
  timeOutgoing: {
    color: colors.onAction
  }
});
