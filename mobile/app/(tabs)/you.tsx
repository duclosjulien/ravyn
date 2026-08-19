import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "../../src/components/AppScreen";
import { Avatar } from "../../src/components/Avatar";
import { mockProfile } from "../../src/data/mockAppShell";
import { colors, spacing, typography } from "../../src/theme";

export default function YouScreen() {
  return (
    <AppScreen title="You">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identity}>
          <Avatar initials={mockProfile.initials} size="large" />
          <Text style={styles.displayName}>{mockProfile.displayName}</Text>
          <Text style={styles.username}>@{mockProfile.username}</Text>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl
  },
  identity: {
    alignItems: "center",
    paddingBottom: spacing.xl,
    paddingTop: spacing.md
  },
  displayName: {
    color: colors.text,
    fontFamily: typography.heading,
    fontSize: 24,
    marginTop: spacing.md
  },
  username: {
    color: colors.textSubtle,
    fontFamily: typography.body,
    fontSize: 14,
    marginTop: spacing.xs
  }
});
