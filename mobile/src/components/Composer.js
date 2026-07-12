import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, spacing } from "@/theme";
export function Composer() {
    return (_jsxs(View, { style: styles.container, children: [_jsx(TextInput, { editable: false, placeholder: "Write a note", placeholderTextColor: colors.textMuted, style: styles.input }), _jsx(Pressable, { disabled: true, style: styles.button, children: _jsx(Text, { style: styles.buttonText, children: "Send" }) })] }));
}
const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        borderTopColor: colors.border,
        borderTopWidth: 1,
        flexDirection: "row",
        gap: spacing.sm,
        padding: spacing.md
    },
    input: {
        backgroundColor: colors.inputBackground,
        borderColor: colors.border,
        borderRadius: 14,
        borderWidth: 1,
        color: colors.text,
        flex: 1,
        fontSize: 15,
        minHeight: 44,
        paddingHorizontal: spacing.md
    },
    button: {
        alignItems: "center",
        backgroundColor: colors.action,
        borderRadius: 14,
        justifyContent: "center",
        minHeight: 44,
        paddingHorizontal: spacing.lg
    },
    buttonText: {
        color: colors.onAction,
        fontSize: 15,
        fontWeight: "700"
    }
});
//# sourceMappingURL=Composer.js.map