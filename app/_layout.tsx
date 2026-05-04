import useStore from "@/src/store/useStore";
import {
  requestNotificationPermission,
  scheduleDailyReminder,
  scheduleMotivationNotifications,
} from "@/src/utils/notifications";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

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
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleDailyReminder(notificationSettings);
        await scheduleMotivationNotifications();
      }
    })();
  }, [user, notificationSettings]);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
