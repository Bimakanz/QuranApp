
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Copy, Share2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Clipboard,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetailDzikir() {
    const router = useRouter();
    const { type, arab, indo, ulang } = useLocalSearchParams();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const text = `${arab}\n\nArtinya:\n${indo}\n\nDibaca: ${ulang}`;
        Clipboard.setString(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${arab}\n\nArtinya:\n${indo}\n\nDibaca: ${ulang}`,
            });
        } catch {
            // user cancelled
        }
    };

    // Kapitalisasi tipe
    const typeLabel = typeof type === 'string'
        ? type.charAt(0).toUpperCase() + type.slice(1)
        : 'Dzikir';

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={24} color="#728D8E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>Detail Dzikir</Text>
                <View style={{ width: 24 }} />
            </View>
            <View style={styles.headerDivider} />

            <ScrollView contentContainerStyle={styles.content}>

                {/* Tipe + Ulang badges */}
                <View style={styles.badgeRow}>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>Dzikir {typeLabel}</Text>
                    </View>
                    <View style={styles.ulangBadge}>
                        <Text style={styles.ulangBadgeText}>Dibaca {ulang}</Text>
                    </View>
                </View>

                {/* Ayat Arab */}
                <Text style={styles.arabText}>{arab}</Text>

                <View style={styles.divider} />

                {/* Terjemahan */}
                <Text style={styles.artiLabel}>Terjemahan:</Text>
                <Text style={styles.artiText}>{indo}</Text>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleCopy}>
                        <Copy size={18} color="#728D8E" />
                        <Text style={styles.actionText}>{copied ? 'Tersalin!' : 'Salin'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                        <Share2 size={18} color="#728D8E" />
                        <Text style={styles.actionText}>Bagikan</Text>
                    </TouchableOpacity>
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
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        textAlign: 'center',
        marginHorizontal: 16,
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
        padding: 24,
        paddingBottom: 60,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
    },
    typeBadge: {
        backgroundColor: '#E8F0F0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    typeBadgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#32665C',
    },
    ulangBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    ulangBadgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    arabText: {
        fontFamily: 'NotoNaskhArabic',
        fontSize: 28,
        color: '#1a1a1a',
        textAlign: 'right',
        writingDirection: 'rtl',
        lineHeight: 48,
        marginBottom: 32,
    },
    divider: {
        height: 1,
        backgroundColor: '#EAEBE8',
        marginVertical: 24,
    },
    artiLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: TEAL,
        marginBottom: 8,
    },
    artiText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 24,
        marginBottom: 40,
    },

    /* Action Buttons */
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F0F0',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: TEAL,
    },
});
