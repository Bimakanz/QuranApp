import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, BookOpen, Clock, Moon, Sun } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Notifikasi() {
    const router = useRouter();

    // Dummy states untuk Switch Toggle
    const [waktuSholat, setWaktuSholat] = useState(true);
    const [ayatHarian, setAyatHarian] = useState(true);
    const [pengingatTadarus, setPengingatTadarus] = useState(false);

    // Data Notifikasi Terbaru
    const notifications = [
        {
            id: '1',
            type: 'dzuhur',
            title: 'Waktu Dzuhur',
            time: '12:05',
            desc: 'Waktu sholat Dzuhur telah tiba. Jangan lupa untuk menunaikan sholat.',
            isNew: true,
        },
        {
            id: '2',
            type: 'ayat',
            title: 'Ayat Hari Ini',
            time: '06:00',
            desc: '"Dan bersabarlah, sesungguhnya Allah beserta orang-orang yang sabar." - QS. Al-Anfal: 46',
            isNew: true,
        },
        {
            id: '3',
            type: 'subuh',
            title: 'Waktu Subuh',
            time: '04:30',
            desc: 'Waktu sholat Subuh telah tiba. Bangun dan raih keberkahan pagi.',
            isNew: false,
        },
        {
            id: '4',
            type: 'tadarus',
            title: 'Pengingat Tadarus',
            time: '20:00',
            desc: 'Sudahkah kamu membaca Al-Quran hari ini? Yuk lanjutkan bacaanmu.',
            isNew: false,
        },
        {
            id: '5',
            type: 'maghrib',
            title: 'Waktu Maghrib',
            time: '17:55',
            desc: 'Waktu sholat Maghrib telah tiba. Segera tunaikan sholat.',
            isNew: false,
        },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'dzuhur':
                return <Sun size={20} color={TEAL} />;
            case 'ayat':
                return <BookOpen size={20} color={TEAL} />;
            case 'subuh':
            case 'maghrib':
                return <Moon size={20} color={TEAL} />;
            case 'tadarus':
                return <Clock size={20} color={TEAL} />;
            default:
                return <Bell size={20} color={TEAL} />;
        }
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={24} color="#728D8E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifikasi</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Bagian Pengaturan Notifikasi */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Pengaturan Notifikasi</Text>
                    <View style={styles.cardSettings}>
                        {/* Waktu Sholat */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingLabelContainer}>
                                <Bell size={20} color="#888" style={styles.settingIcon} />
                                <Text style={styles.settingLabel}>Waktu Sholat</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#E0E0E0', true: '#728D8E' }}
                                thumbColor="#fff"
                                ios_backgroundColor="#E0E0E0"
                                onValueChange={() => setWaktuSholat(!waktuSholat)}
                                value={waktuSholat}
                                style={styles.switchControl}
                            />
                        </View>
                        <View style={styles.divider} />

                        {/* Ayat Harian */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingLabelContainer}>
                                <BookOpen size={20} color="#888" style={styles.settingIcon} />
                                <Text style={styles.settingLabel}>Ayat Harian</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#E0E0E0', true: '#728D8E' }}
                                thumbColor="#fff"
                                ios_backgroundColor="#E0E0E0"
                                onValueChange={() => setAyatHarian(!ayatHarian)}
                                value={ayatHarian}
                                style={styles.switchControl}
                            />
                        </View>
                        <View style={styles.divider} />

                        {/* Pengingat Tadarus */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingLabelContainer}>
                                <Clock size={20} color="#888" style={styles.settingIcon} />
                                <Text style={styles.settingLabel}>Pengingat Tadarus</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#E0E0E0', true: '#728D8E' }}
                                thumbColor="#fff"
                                ios_backgroundColor="#E0E0E0"
                                onValueChange={() => setPengingatTadarus(!pengingatTadarus)}
                                value={pengingatTadarus}
                                style={styles.switchControl}
                            />
                        </View>
                    </View>
                </View>

                {/* Bagian Notifikasi Terbaru */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Notifikasi Terbaru</Text>
                    <View style={styles.notificationList}>
                        {notifications.map((item) => (
                            <View key={item.id} style={styles.notificationCard}>
                                <View style={styles.notificationIconWrapper}>
                                    {getIcon(item.type)}
                                </View>
                                <View style={styles.notificationContent}>
                                    <View style={styles.notificationHeader}>
                                        <Text style={styles.notificationTitle}>{item.title}</Text>
                                        <View style={styles.notificationTimeContainer}>
                                            <Text style={styles.notificationTime}>{item.time}</Text>
                                            {item.isNew && <View style={styles.dotIndicator} />}
                                        </View>
                                    </View>
                                    <Text style={styles.notificationDesc}>{item.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const BG = '#FDFBF7';
const TEAL = '#728D8E';

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: BG,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        marginBottom: 8,
    },
    iconBtn: {
        padding: 4,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    cardSettings: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 2,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
    },
    settingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        marginRight: 14,
    },
    settingLabel: {
        fontSize: 15,
        color: '#444',
    },
    switchControl: {
        transform: [{ scaleX: 1.0 }, { scaleY: 1.0 }],
    },
    divider: {
        height: 1,
        backgroundColor: '#f5f5f5',
        marginLeft: 36, // align with text
    },
    notificationList: {
        gap: 12,
    },
    notificationCard: {
        backgroundColor: '#F5F6F2', // Sedikit berbeda warnanya, atau abu cream mirip referensi
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    notificationIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EAEBE8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    notificationTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    notificationTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationTime: {
        fontSize: 12,
        color: '#8A9A9A',
    },
    dotIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: TEAL,
        marginLeft: 8,
    },
    notificationDesc: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
});
