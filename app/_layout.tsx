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

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="SuratQuran" options={{ headerShown: false }} />
        <Stack.Screen name="DoaHarian" options={{ headerShown: false }} />
        <Stack.Screen name="DetailDoa" options={{ headerShown: false }} />
        <Stack.Screen name="Dzikir" options={{ headerShown: false }} />
        <Stack.Screen name="Hadits" options={{ headerShown: false }} />
        <Stack.Screen name="DetailDzikir" options={{ headerShown: false }} />
        <Stack.Screen name="DetailHadits" options={{ headerShown: false }} />
        <Stack.Screen name="ArahKiblat" options={{ headerShown: false }} />
        <Stack.Screen name="Donasi" options={{ headerShown: false }} />
        <Stack.Screen name="AsmaulHusna" options={{ headerShown: false }} />
        <Stack.Screen name="Lainnya" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
