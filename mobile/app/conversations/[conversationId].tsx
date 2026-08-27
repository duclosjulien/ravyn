import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Composer } from "../../src/components/Composer";
import { ConversationHeader } from "../../src/components/ConversationHeader";
import { MessageList } from "../../src/components/MessageList";
import {
  mockConversationDetails,
  mockConversations
} from "../../src/data/mockAppShell";
import { colors, spacing, typography } from "../../src/theme";

export default function ConversationScreen() {
  const router = useRouter();
  const { conversationId } = useLocalSearchParams<{
    conversationId?: string | string[];
  }>();
  const resolvedId = Array.isArray(conversationId)
    ? conversationId[0]
    : conversationId;
  const conversation = mockConversations.find(item => item.id === resolvedId);
  const detail = resolvedId ? mockConversationDetails[resolvedId] : undefined;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/chats");
  };

  if (!conversation || !detail) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <View style={styles.unavailableHeader}>
          <Pressable
            accessibilityLabel="Back to Chats"
            accessibilityRole="button"
            hitSlop={8}
            onPress={handleBack}
            style={styles.backButton}
          >
            <Ionicons color={colors.text} name="arrow-back" size={22} />
          </Pressable>
        </View>
        <View style={styles.unavailable}>
          <Text style={styles.unavailableTitle}>Conversation unavailable</Text>
          <Text style={styles.unavailableCopy}>
            This mock conversation could not be found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <ConversationHeader conversation={conversation} onBack={handleBack} />
      <MessageList dateLabel={detail.dateLabel} messages={detail.messages} />
      <Composer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  unavailableHeader: {
    minHeight: 72,
    paddingHorizontal: spacing.sm
  },
  backButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44
  },
  unavailable: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg
  },
  unavailableTitle: {
    color: colors.text,
    fontFamily: typography.heading,
    fontSize: 24,
    textAlign: "center"
  },
  unavailableCopy: {
    color: colors.textSubtle,
    fontFamily: typography.body,
    fontSize: 14,
    marginTop: spacing.sm,
    textAlign: "center"
  }
});
