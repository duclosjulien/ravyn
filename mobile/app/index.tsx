import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { Composer } from "@/components/Composer";
import { ConversationList } from "@/components/ConversationList";
import { MessageThread } from "@/components/MessageThread";
import { mockConversations, mockMessages } from "@/data/mockChat";
import { colors, spacing } from "@/theme";

export default function ChatPrototypeScreen() {
  const [activeConversationId, setActiveConversationId] = useState(
    mockConversations[0]?.id ?? ""
  );

  const activeConversation = useMemo(
    () =>
      mockConversations.find(
        conversation => conversation.id === activeConversationId
      ) ?? mockConversations[0],
    [activeConversationId]
  );

  const messages = activeConversation
    ? mockMessages[activeConversation.id] ?? []
    : [];

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.shell}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>Ravyn</Text>
          <Text style={styles.subtitle}>Private notes, quietly kept.</Text>
        </View>

        <ConversationList
          conversations={mockConversations}
          activeConversationId={activeConversation?.id}
          onSelectConversation={setActiveConversationId}
        />

        {activeConversation ? (
          <View style={styles.threadPanel}>
            <View style={styles.threadHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {activeConversation.otherUsername.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.threadTitle}>
                  {activeConversation.otherUsername}
                </Text>
                <Text style={styles.threadStatus}>Mock mobile preview</Text>
              </View>
            </View>

            <MessageThread messages={messages} currentUserId="user-julien" />
            <Composer />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  shell: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md
  },
  brand: {
    color: colors.text,
    fontFamily: Platform.select({ ios: "Georgia", default: "serif" }),
    fontSize: 38,
    fontWeight: "500",
    letterSpacing: 1
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: 4
  },
  threadPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    overflow: "hidden"
  },
  threadHeader: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  avatarText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700"
  },
  threadTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700"
  },
  threadStatus: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2
  }
});
