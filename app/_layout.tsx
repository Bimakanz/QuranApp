import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    'NotoNaskhArabic': require('../assets/fonts/NotoNaskhArabic.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const screenOptions = {
    headerShown: false,
    animation: 'slide_from_right' as const,
    animationDuration: 250,
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="SuratQuran" />
        <Stack.Screen name="DoaHarian" />
        <Stack.Screen name="DetailDoa" />
        <Stack.Screen name="Dzikir" />
        <Stack.Screen name="Hadits" />
        <Stack.Screen name="DetailDzikir" />
        <Stack.Screen name="DetailHadits" />
        <Stack.Screen name="ArahKiblat" />
        <Stack.Screen name="Donasi" />
        <Stack.Screen name="AsmaulHusna" />
        <Stack.Screen name="Lainnya" />
        <Stack.Screen name="Notifikasi" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', animation: 'slide_from_bottom', headerShown: true, title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
