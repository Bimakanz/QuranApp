import { useRouter } from 'expo-router';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import React from 'react';
import {
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Donasi() {
    const router = useRouter();

    const handleOpenSaweria = () => {
        Linking.openURL('https://saweria.co'); // Placeholder link, user should replace with their own if they have one or keep as is for generic saweria
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={24} color="#728D8E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dukung Developer</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Share2 size={20} color="#728D8E" />
                </TouchableOpacity>
            </View>
            <View style={styles.headerDivider} />

            <ScrollView contentContainerStyle={styles.content}>

                {/* Milestone Support */}
                <View style={[styles.card, styles.milestoneCard]}>
                    <Text style={styles.cardTitle}>Milestone Dukungan</Text>
                    <Text style={styles.cardDesc}>
                        QuranApp adalah aplikasi gratis tanpa iklan yang dibuat dengan penuh cinta
                    </Text>

                    {/* Progress Bar Container with Shadow Effect */}
                    <View style={styles.progressBoxShadow}>
                        <View style={styles.progressBox}>
                            <Text style={styles.progressTitle}>Bayar server dan akomodasi</Text>
                            <View style={styles.progressBarBg}>
                                {/* Example progress: 0% */}
                                <View style={[styles.progressBarFill, { width: '0%' }]} />
                            </View>
                            <Text style={styles.progressAmount}>Rp0  /  Rp50.000.000</Text>
                        </View>
                    </View>
                </View>

                {/* Section Title */}
                <Text style={styles.sectionTitle}>DUKUNGAN VIA SAWERIA</Text>

                {/* QR Code Card */}
                <View style={styles.card}>
                    <Text style={styles.qrTitle}>Scan QR atau buka Saweria</Text>
                    <Text style={styles.qrDesc}>
                        Semua dukungan akan masuk langsung ke akun developer.
                    </Text>

                    <View style={styles.qrContainer}>
                        <View style={styles.qrShadow}>
                            <Image
                                source={require('../assets/images/Qrcode.jpg')}
                                style={styles.qrImage}
                                resizeMode="cover"
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.actionBtn} onPress={handleOpenSaweria} activeOpacity={0.8}>
                        <Text style={styles.actionBtnText}>Buka Saweria</Text>
                    </TouchableOpacity>
                </View>

                {/* Notes Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Catatan Development & Transparansi</Text>
                    <Text style={styles.noteItem}>1. Ini dukungan untuk developer, bukan penggalangan donasi lembaga.</Text>
                    <Text style={styles.noteItem}>2. Penyaluran ke pihak lain sepenuhnya keputusan pribadi developer.</Text>
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
    content: {
        padding: 20,
        paddingBottom: 60,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#888',
        marginBottom: 12,
        marginLeft: 4,
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#EAEBE8',
    },
    milestoneCard: {
        paddingBottom: 24,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    cardDesc: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
        marginBottom: 20,
    },

    // Progress Box Styles (Neo-brutalism inspired from mockup)
    progressBoxShadow: {
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        marginLeft: 4,
        marginTop: 4,
    },
    progressBox: {
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#1a1a1a',
        borderRadius: 8,
        padding: 16,
        transform: [{ translateX: -4 }, { translateY: -4 }],
    },
    progressTitle: {
        fontFamily: 'monospace',
        fontSize: 14,
        color: '#1a1a1a',
        marginBottom: 16,
    },
    progressBarBg: {
        height: 24,
        borderWidth: 1,
        borderColor: '#1a1a1a',
        borderRadius: 6,
        backgroundColor: '#fff',
        marginBottom: 16,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4A90E2', // Can be changed
    },
    progressAmount: {
        fontFamily: 'monospace',
        fontSize: 14,
        color: '#1a1a1a',
        textAlign: 'center',
    },

    // QR Section
    qrTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    qrDesc: {
        fontSize: 12,
        color: '#666',
        marginBottom: 24,
    },
    qrContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    qrShadow: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        paddingRight: 6,
        paddingBottom: 6,
    },
    qrImage: {
        width: 200,
        height: 200,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1a1a1a',
        backgroundColor: '#fff',
        transform: [{ translateX: -3 }, { translateY: -3 }],
    },

    actionBtn: {
        backgroundColor: '#728D8E', // Teal color matching other buttons
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },

    // Notes
    noteItem: {
        fontSize: 12,
        color: '#555',
        lineHeight: 20,
        marginTop: 6,
    },
});
