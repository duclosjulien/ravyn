import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";
export function ConversationList({ conversations, activeConversationId, onSelectConversation }) {
    return (_jsx(View, { style: styles.container, children: _jsx(FlatList, { data: conversations, horizontal: true, keyExtractor: item => item.id, showsHorizontalScrollIndicator: false, contentContainerStyle: styles.list, renderItem: ({ item }) => {
                const isActive = item.id === activeConversationId;
                return (_jsxs(Pressable, { onPress: () => onSelectConversation(item.id), style: [styles.item, isActive && styles.itemActive], children: [_jsx(Text, { style: [styles.name, isActive && styles.nameActive], children: item.otherUsername }), _jsx(Text, { numberOfLines: 1, style: [styles.preview, isActive && styles.previewActive], children: item.lastMessageContent })] }));
            } }) }));
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
//# sourceMappingURL=ConversationList.js.map