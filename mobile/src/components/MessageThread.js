import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";
export function MessageThread({ messages, currentUserId }) {
    return (_jsx(FlatList, { data: messages, keyExtractor: item => item.id, contentContainerStyle: styles.list, renderItem: ({ item }) => {
            const isOutgoing = item.senderId === currentUserId;
            return (_jsx(View, { style: [
                    styles.messageRow,
                    isOutgoing ? styles.messageRowOutgoing : styles.messageRowIncoming
                ], children: _jsxs(View, { style: [
                        styles.bubble,
                        isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming
                    ], children: [_jsx(Text, { style: [
                                styles.messageText,
                                isOutgoing && styles.messageTextOutgoing
                            ], children: item.content }), _jsx(Text, { style: [styles.time, isOutgoing && styles.timeOutgoing], children: item.createdAtLabel })] }) }));
        } }));
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
//# sourceMappingURL=MessageThread.js.map