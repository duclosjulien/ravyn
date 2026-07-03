import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/theme";
import { ConversationPreview } from "@/types/chat";

interface ConversationListProps {
  conversations: ConversationPreview[];
  activeConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation
}: ConversationListProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        horizontal
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isActive = item.id === activeConversationId;

          return (
            <Pressable
              onPress={() => onSelectConversation(item.id)}
              style={[styles.item, isActive && styles.itemActive]}
            >
              <Text style={[styles.name, isActive && styles.nameActive]}>
                {item.otherUsername}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.preview, isActive && styles.previewActive]}
              >
                {item.lastMessageContent}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md
  },
  list: {
    gap: spacing.sm,
    paddingRight: spacing.lg
  },
  item: {
    backgroundColor: colors.appSurface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 74,
    padding: spacing.md,
    width: 188
  },
  itemActive: {
    backgroundColor: colors.action,
    borderColor: colors.action
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700"
  },
  nameActive: {
    color: colors.onAction
  },
  preview: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 6
  },
  previewActive: {
    color: colors.onAction
  }
});
