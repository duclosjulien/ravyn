import { FlatList, StyleSheet, Text } from "react-native";

import { AppScreen } from "../../src/components/AppScreen";
import { ConnectionRow } from "../../src/components/ConnectionRow";
import { mockConnections } from "../../src/data/mockAppShell";
import { colors, spacing, typography } from "../../src/theme";

export default function ConnectionsScreen() {
  return (
    <AppScreen title="Connections">
      <Text style={styles.sectionLabel}>Your connections</Text>
      <FlatList
        contentContainerStyle={styles.list}
        data={mockConnections}
        keyExtractor={connection => connection.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your connections will appear here.</Text>
        }
        renderItem={({ item }) => <ConnectionRow connection={item} />}
        showsVerticalScrollIndicator={false}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    color: colors.textSubtle,
    fontFamily: typography.body,
    fontSize: 13,
    marginBottom: spacing.sm
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.xl
  },
  emptyText: {
    color: colors.textSubtle,
    fontFamily: typography.body,
    fontSize: 14,
    paddingVertical: spacing.xl,
    textAlign: "center"
  }
});
