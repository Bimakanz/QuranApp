import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Book,
    BookOpen,
    Calculator,
    Calendar,
    ChevronRight,
    Coins,
    Compass,
    FileText,
    Heart,
    PlayCircle,
    Settings
} from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Lainnya() {
    const router = useRouter();

    const topGridItems = [
        { label: 'Al-Quran', Icon: BookOpen, route: '/(tabs)/AlQuran' },
        { label: 'Doa Harian', Icon: FileText, route: '/DoaHarian' },
        { label: 'Dzikir Duha', Icon: Heart, route: '/Dzikir' },
        { label: 'Hadits', Icon: FileText, route: '/Hadits' },
        { label: 'Arah Kiblat', Icon: Compass, route: '/ArahKiblat' },
        { label: 'Donasi', Icon: Coins, route: '/Donasi' },
        { label: 'Asmaul Husna', Icon: Book, route: '/AsmaulHusna' },
    ];

    const listItems = [
        {
            title: 'Kalender Hijriah',
            subtitle: 'Tanggal hijriah hari ini dan info singkat',
            Icon: Calendar,
        },
        {
            title: 'Zakat Calculator',
            subtitle: 'Hitung zakat mal dengan cepat',
            Icon: Calculator,
        },
        {
            title: 'Kajian Online',
            subtitle: 'Akses kajian dari berbagai sumber',
            Icon: PlayCircle,
        },
    ];

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={24} color="#728D8E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lainnya</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Settings size={22} color="#728D8E" />
                </TouchableOpacity>
            </View>
            <View style={styles.headerDivider} />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Top Grid */}
                <View style={styles.gridContainer}>
                    {topGridItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.gridItem}
                            onPress={() => item.route ? router.push(item.route as any) : null}
                            activeOpacity={0.7}
                        >
                            <View style={styles.gridIconContainer}>
                                <item.Icon size={24} color="#728D8E" />
                            </View>
                            <Text style={styles.gridLabel}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* List Section */}
                <View style={styles.listSection}>
                    <Text style={styles.sectionTitle}>LAINNYA</Text>

                    <View style={styles.cardsContainer}>
                        {listItems.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.listCard} activeOpacity={0.7}>
                                <View style={styles.cardIconContainer}>
                                    <item.Icon size={22} color="#728D8E" />
                                </View>
                                <View style={styles.cardTextContainer}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
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

const BG = '#FDFBF7';
const TEAL = '#728D8E';

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: BG,
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    iconBtn: {
        padding: 4,
    },
    headerDivider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },

    /* Content */
    content: {
        paddingBottom: 40,
    },

    /* Top Grid */
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        paddingTop: 32,
        paddingBottom: 24,
        justifyContent: 'flex-start',
    },
    gridItem: {
        width: '25%', // 4 items per row
        alignItems: 'center',
        marginBottom: 24,
    },
    gridIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E8F0F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    gridLabel: {
        fontSize: 12,
        color: '#444',
        textAlign: 'center',
        fontWeight: '500',
    },

    /* List Section */
    listSection: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#666',
        letterSpacing: 1,
        marginBottom: 16,
    },
    cardsContainer: {
        gap: 12,
    },
    listCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EAEBE8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    cardIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#888',
    },
});
