import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Copy, Share2 } from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetailDoa() {
    const router = useRouter();

    // Menerima parameter dari halaman sebelumnya (DoaHarian)
    const { title, arab, latin, arti } = useLocalSearchParams();

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={24} color="#728D8E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
                <View style={{ width: 24 }} /> {/* placeholder for balance */}
            </View>
            <View style={styles.headerDivider} />

            <ScrollView contentContainerStyle={styles.content}>

                {/* Ayat Arab */}
                <Text style={styles.arabText}>{arab}</Text>

                {/* Latin */}
                <Text style={styles.latinLabel}>Latin:</Text>
                <Text style={styles.latinText}>{latin}</Text>

                <View style={styles.divider} />

                {/* Artinya */}
                <Text style={styles.artiLabel}>Artinya:</Text>
                <Text style={styles.artiText}>{arti}</Text>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Copy size={18} color="#728D8E" />
                        <Text style={styles.actionText}>Salin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
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
    doaTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 32,
        textAlign: 'center',
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
    latinLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: TEAL,
        marginBottom: 8,
    },
    latinText: {
        fontSize: 15,
        color: '#444',
        lineHeight: 24,
        fontStyle: 'italic',
        marginBottom: 24,
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
