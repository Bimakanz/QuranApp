import AsyncStorage from '@react-native-async-storage/async-storage';

const PREF_KEY = '@notif_waktu_sholat';

export type PrayerTime = {
    name: string;
    time: string;
};

// Note: expo-notifications removed — does not work reliably in Expo Go SDK 53+.
// Notification scheduling is a stub; preferences are still saved to AsyncStorage.
// To enable real notifications, build a development build with `npx expo run:android`.

export async function requestNotificationPermission(): Promise<boolean> {
    // Always return true in stub mode — no actual permission needed
    return true;
}

export async function schedulePrayerNotifications(_prayers: PrayerTime[]): Promise<void> {
    // Stub — notifications will be enabled when using a development build
    console.log('[NotificationService] Prayer notifications scheduled (stub mode)');
}

export async function cancelPrayerNotifications(): Promise<void> {
    console.log('[NotificationService] Prayer notifications cancelled (stub mode)');
}

export async function saveNotificationPref(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(PREF_KEY, JSON.stringify(enabled));
}

export async function loadNotificationPref(): Promise<boolean> {
    const raw = await AsyncStorage.getItem(PREF_KEY);
    if (raw === null) return false;
    return JSON.parse(raw) as boolean;
}
