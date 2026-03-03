import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Copy, Share2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Clipboard,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEAL = '#728D8E';
const BG = '#F5F0E8';

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
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color={TEAL} />
                </TouchableOpacity>
                <Text style={{ flex: 1, fontSize: 18, fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginHorizontal: 16 }} numberOfLines={1}>
                    Detail Hadits
                </Text>
                <View style={{ width: 24 }} />
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.05)' }} />

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>

                {/* Source badges */}
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
                    <View style={{ backgroundColor: '#E8F0F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#32665C' }}>HR. {book}</Text>
                    </View>
                    <View style={{ backgroundColor: '#F5F5F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#666' }}>No. {number}</Text>
                    </View>
                </View>

                {/* Teks Arab */}
                <Text style={{ fontFamily: 'NotoNaskhArabic', fontSize: 28, color: '#1a1a1a', textAlign: 'right', lineHeight: 48, marginBottom: 32 }}>
                    {arab}
                </Text>

                <View style={{ height: 1, backgroundColor: '#EAEBE8', marginVertical: 24 }} />

                {/* Terjemahan */}
                <Text style={{ fontSize: 14, fontWeight: '600', color: TEAL, marginBottom: 8 }}>Terjemahan:</Text>
                <Text style={{ fontSize: 15, color: '#333', lineHeight: 24, marginBottom: 40 }}>
                    {terjemah}
                </Text>

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F0F0', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, gap: 8 }}
                        onPress={handleCopy}
                        activeOpacity={0.7}
                    >
                        <Copy size={18} color={TEAL} />
                        <Text style={{ fontSize: 14, fontWeight: '600', color: TEAL }}>{copied ? 'Tersalin!' : 'Salin'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F0F0', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, gap: 8 }}
                        onPress={handleShare}
                        activeOpacity={0.7}
                    >
                        <Share2 size={18} color={TEAL} />
                        <Text style={{ fontSize: 14, fontWeight: '600', color: TEAL }}>Bagikan</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
