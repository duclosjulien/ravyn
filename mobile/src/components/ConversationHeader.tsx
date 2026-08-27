import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../theme";
import type { ConversationPreview } from "../types/appShell";
import { Avatar } from "./Avatar";

interface ConversationHeaderProps {
  conversation: ConversationPreview;
  onBack: () => void;
}

interface HeaderIconButtonProps {
  accessibilityLabel: string;
  icon: "arrow-back" | "notifications-outline" | "ellipsis-horizontal";
  onPress?: () => void;
}

function HeaderIconButton({
  accessibilityLabel,
  icon,
  onPress
}: HeaderIconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        pressed && onPress && styles.iconButtonPressed
      ]}
    >
      <Ionicons color={colors.text} name={icon} size={22} />
    </Pressable>
  );
}

export function ConversationHeader({
  conversation,
  onBack
}: ConversationHeaderProps) {
  return (
    <View style={styles.header}>
      <HeaderIconButton
        accessibilityLabel="Back to Chats"
        icon="arrow-back"
        onPress={onBack}
      />
      <Avatar initials={conversation.initials} />
      <Text accessibilityRole="header" numberOfLines={1} style={styles.name}>
        {conversation.displayName}
      </Text>
      <HeaderIconButton
        accessibilityLabel="Conversation notifications"
        icon="notifications-outline"
      />
      <HeaderIconButton
        accessibilityLabel="More conversation options"
        icon="ellipsis-horizontal"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 72,
    paddingHorizontal: spacing.sm
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  iconButtonPressed: {
    backgroundColor: colors.softSurface
  },
  name: {
    color: colors.text,
    flex: 1,
    fontFamily: typography.heading,
    fontSize: 19
  }
});
