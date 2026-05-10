import useStore from "@/src/store/useStore";
import { scheduleAllNotifications } from "@/src/utils/notifications";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ImageBackground, View } from "react-native";

export default function RootLayout() {
  const user = useStore((s) => s.user);
  const hydrate = useStore((s) => s.hydrate);
  const notificationSettings = useStore((s) => s.notificationSettings);
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (user === undefined) return;

    const inTabsGroup = segments[0] === "(tabs)";

    if (user && !inTabsGroup) {
      router.replace("/(tabs)");
    } else if (!user && segments[0] !== "onboarding") {
      router.replace("/onboarding");
    }
  }, [isReady, user, segments]);

  useEffect(() => {
    if (!user || !notificationSettings) return;

    (async () => {
      await scheduleAllNotifications(notificationSettings);
    })();
  }, [user, notificationSettings]);

  return (
    <ImageBackground
      source={require("@/assets/images/Vintage_2.jpeg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ flex: 1 }}>
        <StatusBar style="dark" />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        >
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </ImageBackground>
  );
}
