import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

import { colors, typography } from "../../src/theme";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="chats"
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.action,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar
      }}
    >
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarAccessibilityLabel: "Chats tab",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"}
              size={size}
            />
          )
        }}
      />
      <Tabs.Screen
        name="connections"
        options={{
          title: "Connections",
          tabBarAccessibilityLabel: "Connections tab",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? "people" : "people-outline"}
              size={size}
            />
          )
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          title: "You",
          tabBarAccessibilityLabel: "You tab",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? "person" : "person-outline"}
              size={size}
            />
          )
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.appSurface,
    borderTopColor: colors.border,
    minHeight: 64,
    paddingBottom: 6,
    paddingTop: 6
  },
  label: {
    fontFamily: typography.body,
    fontSize: 11
  }
});
