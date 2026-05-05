import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/utils/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: "transparent" },
        tabBarStyle: {
          backgroundColor: COLORS.tabBg,
          borderTopColor: COLORS.bgCardBorder,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: COLORS.tabActive,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginTop: 2 },
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, { active: string; inactive: string }> = {
            index: { active: "home", inactive: "home-outline" },
            trophies: { active: "trophy", inactive: "trophy-outline" },
            stats: { active: "bar-chart", inactive: "bar-chart-outline" },
          };
          const icon = icons[route.name];
          return (
            <Ionicons
              name={(focused ? icon?.active : icon?.inactive) as any}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Grimpe" }} />
      <Tabs.Screen name="trophies" options={{ title: "Trophées" }} />
      <Tabs.Screen name="stats" options={{ title: "Stats" }} />
    </Tabs>
  );
}
