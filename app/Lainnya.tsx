import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    BookOpen,
    BookOpenText,
    Calculator,
    Calendar,
    ChevronRight,
    Compass,
    HandCoins,
    Heart,
    MessageCircle,
    PlayCircle,
    Scroll,
    Settings
} from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEAL = '#728D8E';
const BG = '#FDFBF7';

export default function Lainnya() {
    const router = useRouter();

    const topGridItems = [
        { label: 'Al-Quran', Icon: BookOpen, route: '/(tabs)/AlQuran' },
        { label: 'Doa Harian', Icon: MessageCircle, route: '/DoaHarian' },
        { label: 'Dzikir Duha', Icon: Heart, route: '/Dzikir' },
        { label: 'Hadits', Icon: Scroll, route: '/Hadits' },
        { label: 'Arah Kiblat', Icon: Compass, route: '/ArahKiblat' },
        { label: 'Donasi', Icon: HandCoins, route: '/Donasi' },
        { label: 'Asmaul Husna', Icon: BookOpenText, route: '/AsmaulHusna' },
    ];

    const listItems = [
        { title: 'Kalender Hijriah', subtitle: 'Tanggal hijriah hari ini dan info singkat', Icon: Calendar, route: '/KalenderHijrah' },
        { title: 'Zakat Calculator', subtitle: 'Hitung zakat mal dengan cepat', Icon: Calculator, route: '/KalkulatorZakat' },
        { title: 'Kajian Online', subtitle: 'Akses kajian dari berbagai sumber', Icon: PlayCircle, route: null },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color={TEAL} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a1a' }}>Lainnya</Text>
                <TouchableOpacity style={{ padding: 4 }}>
                    <Settings size={22} color={TEAL} />
                </TouchableOpacity>
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.05)' }} />

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Top Grid */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, paddingTop: 32, paddingBottom: 24, justifyContent: 'flex-start' }}>
                    {topGridItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{ width: '25%', alignItems: 'center', marginBottom: 24 }}
                            onPress={() => item.route ? router.push(item.route as any) : null}
                            activeOpacity={0.7}
                        >
                            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#E8F0F0', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                <item.Icon size={24} color={TEAL} />
                            </View>
                            <Text style={{ fontSize: 12, color: '#444', textAlign: 'center', fontWeight: '500' }}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* List Section */}
                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#666', letterSpacing: 1, marginBottom: 16 }}>LAINNYA</Text>

                    <View style={{ gap: 12 }}>
                        {listItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
                                    padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#EAEBE8',
                                    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.02, shadowRadius: 4, elevation: 1,
                                }}
                                activeOpacity={0.7}
                                onPress={() => item.route ? router.push(item.route as any) : null}
                            >
                                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                    <item.Icon size={22} color={TEAL} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 }}>{item.title}</Text>
                                    <Text style={{ fontSize: 12, color: '#888' }}>{item.subtitle}</Text>
                                </View>
                                <ChevronRight size={20} color="#a0a0a0" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
