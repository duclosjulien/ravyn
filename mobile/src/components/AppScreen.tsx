import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing, typography } from "../theme";

interface AppScreenProps {
  children: ReactNode;
  header?: ReactNode;
  title?: string;
}

export function AppScreen({
  children,
  header,
  title
}: AppScreenProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          {header ?? (title ? <Text style={styles.title}>{title}</Text> : null)}
        </View>
        <View style={styles.content}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md
  },
  header: {
    justifyContent: "center",
    minHeight: 72
  },
  title: {
    color: colors.text,
    fontFamily: typography.heading,
    fontSize: 30
  },
  content: {
    flex: 1
  }
});
