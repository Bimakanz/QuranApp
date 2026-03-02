import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MAIN_TABS = [
  { name: 'Home', label: 'Beranda', icon: 'home' },
  { name: 'AlQuran', label: 'Al-Quran', icon: 'book' },
  { name: 'Artikel', label: 'Artikel', icon: 'newspaper' },
  { name: 'Pengaturan', label: 'Pengaturan', icon: 'settings' },
] as const;

function FloatingTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  // Pisahkan route AI dari yang lain
  const mainRoutes = state.routes.filter((r: any) => r.name !== 'AI' && r.name !== 'index' && r.name !== 'explore');
  const aiRoute = state.routes.find((r: any) => r.name === 'AI');

  const navigate = (route: any) => {
    const isFocused = state.index === state.routes.indexOf(route);
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const bottomOffset = insets.bottom + 12;

  // Sembunyikan navbar jika sedang di halaman AI
  const currentRouteName = state.routes[state.index]?.name;
  if (currentRouteName === 'AI') {
    return null;
  }

  return (
    <>
      {/* ── Main floating pill (Home, Al-Quran, Artikel, Pengaturan) ── */}
      <View
        style={[styles.mainWrapper, { bottom: bottomOffset }]}
        pointerEvents="box-none"
      >
        <BlurView intensity={65} tint="light" style={styles.blurContainer}>
          <View style={styles.tabBar}>
            {mainRoutes.map((route: any) => {
              const isFocused = state.routes[state.index]?.key === route.key;
              const tabItem = MAIN_TABS.find(t => t.name === route.name);
              const label = tabItem?.label ?? route.name;
              const iconName = tabItem?.icon ?? 'ellipse';

              return (
                <TouchableOpacity
                  key={route.key}
                  style={styles.tabButton}
                  onPress={() => navigate(route)}
                  activeOpacity={0.7}
                >
                  {isFocused && <View style={styles.activeDot} />}
                  <Ionicons
                    name={isFocused
                      ? (iconName as any)
                      : (`${iconName}-outline` as any)}
                    size={22}
                    color={isFocused ? '#E2C675' : '#888'}
                  />
                  <Text style={[styles.label, isFocused && styles.labelActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>

      {/* ── AI separate floating button ── */}
      {aiRoute && (
        <TouchableOpacity
          style={[styles.aiWrapper, { bottom: bottomOffset }]}
          onPress={() => navigate(aiRoute)}
          activeOpacity={0.85}
        >
          <BlurView intensity={70} tint="light" style={styles.aiBlur}>
            <Ionicons
              name={state.routes[state.index]?.name === 'AI' ? 'sparkles' : 'sparkles-outline'}
              size={22}
              color={state.routes[state.index]?.name === 'AI' ? '#E2C675' : '#888'}
            />
            <Text style={[
              styles.label,
              state.routes[state.index]?.name === 'AI' && styles.labelActive,
            ]}>
              AI
            </Text>
          </BlurView>
        </TouchableOpacity>
      )}
    </>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="Home" options={{ title: 'Beranda' }} />
      <Tabs.Screen name="AlQuran" options={{ title: 'Al-Quran' }} />
      <Tabs.Screen name="Artikel" options={{ title: 'Artikel' }} />
      <Tabs.Screen name="Pengaturan" options={{ title: 'Pengaturan' }} />
      <Tabs.Screen name="AI" options={{ title: 'AI' }} />
      {/* Hidden legacy screens */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

const PILL_RADIUS = 25;

const styles = StyleSheet.create({
  /* ── Main pill ── */
  mainWrapper: {
    position: 'absolute',
    left: 20,
    right: 90,           // beri ruang untuk tombol AI di kanan
    height: 70,
    borderRadius: PILL_RADIUS,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  blurContainer: {
    flex: 1,
    borderRadius: PILL_RADIUS,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 254, 0.8)',
    backgroundColor: '#fff',
  },
  tabBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    minHeight: 44,
    gap: 3,
  },
  activeDot: {
    position: 'absolute',
    top: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2C675',
  },
  label: {
    fontSize: 10,
    color: '#888',
    fontWeight: '500',
    marginTop: 1,
  },
  labelActive: {
    color: '#E2C675',
    fontWeight: '700',
  },

  /* ── AI button ── */
  aiWrapper: {
    position: 'absolute',
    right: 20,
    width: 62,
    height: 70,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  aiBlur: {
    flex: 1,
    borderRadius: PILL_RADIUS,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
});
