import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Composer } from "@/components/Composer";
import { ConversationList } from "@/components/ConversationList";
import { MessageThread } from "@/components/MessageThread";
import { mockConversations, mockMessages } from "@/data/mockChat";
import { colors, spacing } from "@/theme";
export default function ChatPrototypeScreen() {
    const [activeConversationId, setActiveConversationId] = useState(mockConversations[0]?.id ?? "");
    const activeConversation = useMemo(() => mockConversations.find(conversation => conversation.id === activeConversationId) ?? mockConversations[0], [activeConversationId]);
    const messages = activeConversation
        ? mockMessages[activeConversation.id] ?? []
        : [];
    return (_jsx(SafeAreaView, { edges: ["top", "bottom"], style: styles.screen, children: _jsxs(KeyboardAvoidingView, { behavior: Platform.select({ ios: "padding", android: undefined }), style: styles.shell, children: [_jsxs(View, { style: styles.header, children: [_jsx(Text, { style: styles.brand, children: "Ravyn" }), _jsx(Text, { style: styles.subtitle, children: "Private notes, quietly kept." })] }), _jsx(ConversationList, { conversations: mockConversations, activeConversationId: activeConversation?.id, onSelectConversation: setActiveConversationId }), activeConversation ? (_jsxs(View, { style: styles.threadPanel, children: [_jsxs(View, { style: styles.threadHeader, children: [_jsx(View, { style: styles.avatar, children: _jsx(Text, { style: styles.avatarText, children: activeConversation.otherUsername.charAt(0).toUpperCase() }) }), _jsxs(View, { children: [_jsx(Text, { style: styles.threadTitle, children: activeConversation.otherUsername }), _jsx(Text, { style: styles.threadStatus, children: "Mock mobile preview" })] })] }), _jsx(MessageThread, { messages: messages, currentUserId: "user-julien" }), _jsx(Composer, {})] })) : null] }) }));
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
//# sourceMappingURL=index.js.map