import { jsx as _jsx } from "react/jsx-runtime";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "@/theme";
export default function RootLayout() {
    return (_jsx(SafeAreaProvider, { children: _jsx(Stack, { screenOptions: {
                headerShown: false,
                contentStyle: {
                    backgroundColor: colors.background
                }
            } }) }));
}
//# sourceMappingURL=_layout.js.map