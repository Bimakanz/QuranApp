import {
    cancelPrayerNotifications,
    loadNotificationPref,
    requestNotificationPermission,
    saveNotificationPref,
    schedulePrayerNotifications,
} from '@/hooks/notificationService';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, BookOpen, Clock, Moon, Sun } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEAL = '#728D8E';
const BG = '#F5F0E8';

// Default prayer times — in a real app these come from location-based calculation
const DEFAULT_PRAYER_TIMES = [
    { name: 'Subuh', time: '04:30' },
    { name: 'Dzuhur', time: '12:00' },
    { name: 'Ashar', time: '15:15' },
    { name: 'Maghrib', time: '18:00' },
    { name: 'Isya', time: '19:15' },
];

export default function Notifikasi() {
    const router = useRouter();

    const [waktuSholat, setWaktuSholat] = useState(false);
    const [ayatHarian, setAyatHarian] = useState(false);
    const [pengingatTadarus, setPengingatTadarus] = useState(false);
    const [loadingPref, setLoadingPref] = useState(true);

    // Load saved preferences on mount
    useEffect(() => {
        loadNotificationPref().then((pref) => {
            setWaktuSholat(pref);
            setLoadingPref(false);
        });
    }, []);

    const handleWaktuSholatToggle = async (value: boolean) => {
        if (value) {
            // Request permission first
            const granted = await requestNotificationPermission();
            if (!granted) {
                Alert.alert(
                    'Izin Notifikasi',
                    'Izin notifikasi ditolak. Aktifkan notifikasi di Pengaturan perangkat untuk menggunakan fitur ini.',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Schedule notifications for all prayer times
            await schedulePrayerNotifications(DEFAULT_PRAYER_TIMES);
            await saveNotificationPref(true);
            setWaktuSholat(true);

            Alert.alert(
                '✅ Notifikasi Aktif',
                'Kamu akan mendapat pengingat untuk 5 waktu sholat setiap hari.\n\nWaktu yang dijadwalkan:\n' +
                DEFAULT_PRAYER_TIMES.map(p => `• ${p.name}: ${p.time}`).join('\n'),
                [{ text: 'OK' }]
            );
        } else {
            // Cancel all prayer notifications
            await cancelPrayerNotifications();
            await saveNotificationPref(false);
            setWaktuSholat(false);
        }
    };

    const notifications = [
        { id: '1', type: 'dzuhur', title: 'Waktu Dzuhur', time: '12:05', desc: 'Waktu sholat Dzuhur telah tiba. Jangan lupa untuk menunaikan sholat.', isNew: true },
        { id: '2', type: 'ayat', title: 'Ayat Hari Ini', time: '06:00', desc: '"Dan bersabarlah, sesungguhnya Allah beserta orang-orang yang sabar." - QS. Al-Anfal: 46', isNew: true },
        { id: '3', type: 'subuh', title: 'Waktu Subuh', time: '04:30', desc: 'Waktu sholat Subuh telah tiba. Bangun dan raih keberkahan pagi.', isNew: false },
        { id: '4', type: 'tadarus', title: 'Pengingat Tadarus', time: '20:00', desc: 'Sudahkah kamu membaca Al-Quran hari ini? Yuk lanjutkan bacaanmu.', isNew: false },
        { id: '5', type: 'maghrib', title: 'Waktu Maghrib', time: '17:55', desc: 'Waktu sholat Maghrib telah tiba. Segera tunaikan sholat.', isNew: false },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'dzuhur': return <Sun size={20} color={TEAL} />;
            case 'ayat': return <BookOpen size={20} color={TEAL} />;
            case 'subuh': case 'maghrib': return <Moon size={20} color={TEAL} />;
            case 'tadarus': return <Clock size={20} color={TEAL} />;
            default: return <Bell size={20} color={TEAL} />;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, marginBottom: 8 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: 16 }}>
                    <ArrowLeft size={24} color={TEAL} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' }}>Notifikasi</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>

                {/* Pengaturan Notifikasi */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 16 }}>Pengaturan Notifikasi</Text>
                    <View style={{
                        backgroundColor: '#fff', borderRadius: 16,
                        paddingHorizontal: 20, paddingVertical: 12,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.04, shadowRadius: 3, elevation: 2,
                    }}>
                        {/* Waktu Sholat */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                                    <Bell size={20} color="#888" style={{ marginRight: 14 }} />
                                    <Text style={{ fontSize: 15, color: '#444' }}>Waktu Sholat</Text>
                                </View>
                                {waktuSholat && (
                                    <Text style={{ fontSize: 11, color: TEAL, marginLeft: 34 }}>
                                        Aktif • 5 waktu sholat per hari
                                    </Text>
                                )}
                            </View>
                            <Switch
                                trackColor={{ false: '#E0E0E0', true: TEAL }}
                                thumbColor="#fff"
                                ios_backgroundColor="#E0E0E0"
                                onValueChange={handleWaktuSholatToggle}
                                value={waktuSholat}
                                disabled={loadingPref}
                            />
                        </View>
                        <View style={{ height: 1, backgroundColor: '#f5f5f5', marginLeft: 36 }} />

                        {/* Ayat Harian */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <BookOpen size={20} color="#888" style={{ marginRight: 14 }} />
                                <Text style={{ fontSize: 15, color: '#444' }}>Ayat Harian</Text>
                            </View>
                            <Switch trackColor={{ false: '#E0E0E0', true: TEAL }} thumbColor="#fff" ios_backgroundColor="#E0E0E0" onValueChange={() => setAyatHarian(!ayatHarian)} value={ayatHarian} />
                        </View>
                        <View style={{ height: 1, backgroundColor: '#f5f5f5', marginLeft: 36 }} />

                        {/* Pengingat Tadarus */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Clock size={20} color="#888" style={{ marginRight: 14 }} />
                                <Text style={{ fontSize: 15, color: '#444' }}>Pengingat Tadarus</Text>
                            </View>
                            <Switch trackColor={{ false: '#E0E0E0', true: TEAL }} thumbColor="#fff" ios_backgroundColor="#E0E0E0" onValueChange={() => setPengingatTadarus(!pengingatTadarus)} value={pengingatTadarus} />
                        </View>
                    </View>
                </View>

                {/* Waktu Sholat Schedule */}
                {waktuSholat && (
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 16 }}>Jadwal Notifikasi Aktif</Text>
                        <View style={{ backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3 }}>
                            {DEFAULT_PRAYER_TIMES.map((p, i) => (
                                <View key={p.name}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
                                        <Text style={{ fontSize: 14, color: '#444', fontWeight: '500' }}>🕌 {p.name}</Text>
                                        <View style={{ backgroundColor: '#E8F0F0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 }}>
                                            <Text style={{ fontSize: 13, color: TEAL, fontWeight: '700' }}>{p.time}</Text>
                                        </View>
                                    </View>
                                    {i < DEFAULT_PRAYER_TIMES.length - 1 && <View style={{ height: 1, backgroundColor: '#f5f5f5' }} />}
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Notifikasi Terbaru */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 16 }}>Notifikasi Terbaru</Text>
                    <View style={{ gap: 12 }}>
                        {notifications.map((item) => (
                            <View key={item.id} style={{ backgroundColor: '#F5F6F2', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'flex-start' }}>
                                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#EAEBE8', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                                    {getIcon(item.type)}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                        <Text style={{ fontSize: 15, fontWeight: '700', color: '#1a1a1a' }}>{item.title}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 12, color: '#8A9A9A' }}>{item.time}</Text>
                                            {item.isNew && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: TEAL, marginLeft: 8 }} />}
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: 14, color: '#666', lineHeight: 22 }}>{item.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
