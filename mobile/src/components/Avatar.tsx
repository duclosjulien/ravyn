import { StyleSheet, Text, View } from "react-native";

import { colors, radii, typography } from "../theme";

interface AvatarProps {
  initials: string;
  size?: "medium" | "large";
}

export function Avatar({ initials, size = "medium" }: AvatarProps) {
  const isLarge = size === "large";

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.avatar, isLarge && styles.avatarLarge]}
    >
      <Text style={[styles.initials, isLarge && styles.initialsLarge]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: radii.round,
    height: 46,
    justifyContent: "center",
    width: 46
  },
  avatarLarge: {
    backgroundColor: colors.action,
    height: 82,
    width: 82
  },
  initials: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: "600"
  },
  initialsLarge: {
    color: colors.onAction,
    fontSize: 24
  }
});
