import { FlatList, Image, StyleSheet, Text } from "react-native";

import { AppScreen } from "../../src/components/AppScreen";
import { ConversationRow } from "../../src/components/ConversationRow";
import { mockConversations } from "../../src/data/mockAppShell";
import { colors, spacing, typography } from "../../src/theme";

const ravynBrand = require("../../assets/RavynLogoAndFeatherIcon.png");

export default function ChatsScreen() {
  return (
    <AppScreen
      header={
        <Image
          accessibilityLabel="Ravyn"
          resizeMode="contain"
          source={ravynBrand}
          style={styles.brand}
        />
      }
    >
      <FlatList
        contentContainerStyle={styles.list}
        data={mockConversations}
        keyExtractor={conversation => conversation.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your conversations will appear here.</Text>
        }
        renderItem={({ item }) => <ConversationRow conversation={item} />}
        showsVerticalScrollIndicator={false}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  brand: {
    height: 44,
    width: 124
  },
  list: {
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
