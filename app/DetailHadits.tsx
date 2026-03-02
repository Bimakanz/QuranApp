
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

export default function DetailHadits() {
    const router = useRouter();
    const { number, arab, terjemah, book } = useLocalSearchParams();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const text = `${arab}\n\nTerjemahan:\n${terjemah}\n\n— ${book} No. ${number}`;
        Clipboard.setString(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${arab}\n\nTerjemahan:\n${terjemah}\n\n— ${book} No. ${number}`,
            });
        } catch {
            // user cancelled
        }
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={24} color="#728D8E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>Detail Hadits</Text>
                <View style={{ width: 24 }} />
            </View>
            <View style={styles.headerDivider} />

            <ScrollView contentContainerStyle={styles.content}>

                {/* Source badge */}
                <View style={styles.badgeRow}>
                    <View style={styles.sourceBadge}>
                        <Text style={styles.sourceBadgeText}>HR. {book}</Text>
                    </View>
                    <View style={styles.numberBadge}>
                        <Text style={styles.numberBadgeText}>No. {number}</Text>
                    </View>
                </View>

                {/* Teks Arab */}
                <Text style={styles.arabText}>{arab}</Text>

                <View style={styles.divider} />

                {/* Terjemahan */}
                <Text style={styles.artiLabel}>Terjemahan:</Text>
                <Text style={styles.artiText}>{terjemah}</Text>

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
    sourceBadge: {
        backgroundColor: '#E8F0F0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    sourceBadgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#32665C',
    },
    numberBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    numberBadgeText: {
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
