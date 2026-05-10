import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { NotificationSettings } from "@/types";

const NOTIF_ID_REMINDER = "reven-daily-reminder";
const NOTIF_ID_MOTIVATION = "reven-daily-motivation";

const MOTIVATION_MESSAGES = [
  "Tu grimpes chaque jour un peu plus haut.",
  "Chaque heure sans rechute est une victoire.",
  "Rappelle-toi pourquoi tu as commencé.",
  "La version future de toi te remercie.",
  "Un jour à la fois. Tu y arrives !",
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return true;
}

export async function scheduleAllNotifications(
  settings: NotificationSettings,
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!settings.enabled) return;

  const randomMsg =
    MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)];

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID_MOTIVATION,
    content: {
      title: "Reven",
      body: randomMsg,
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 12,
      minute: 0,
    },
  });

  if (settings.hour !== 12 || settings.minute !== 0) {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIF_ID_REMINDER,
      content: {
        title: "Reven — Et aujourd'hui ?",
        body: "N'oublie pas de logger ta journée. Chaque jour compte !",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: settings.hour,
        minute: settings.minute,
      },
    });
  }
}
