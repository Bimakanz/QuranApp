import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, Copy, Share2 } from 'lucide-react-native';
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
const TEAL_DARK = '#32665C';
const BG = '#F5F0E8';

export default function DetailHadits() {
    const router = useRouter();
    const { number, arab, terjemah, book } = useLocalSearchParams();
    const [copied, setCopied] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    const handleCopy = () => {
        const text = `${arab}\n\nTerjemahan:\n${terjemah}\n\n— HR. ${book} No. ${number}`;
        Clipboard.setString(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${arab}\n\nTerjemahan:\n${terjemah}\n\n— HR. ${book} No. ${number}\n\nDibagikan dari QuranApp`,
            });
        } catch { }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color={TEAL} />
                </TouchableOpacity>
                <Text style={{ flex: 1, fontSize: 17, fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginHorizontal: 12 }}>
                    Detail Hadits
                </Text>
                <TouchableOpacity onPress={() => setBookmarked(!bookmarked)} style={{ padding: 4 }}>
                    <Bookmark size={22} color={bookmarked ? '#C8A84B' : TEAL} fill={bookmarked ? '#C8A84B' : 'transparent'} />
                </TouchableOpacity>
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.05)' }} />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

                {/* Source Badges */}
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                    <View style={{ backgroundColor: '#E8F0F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: TEAL_DARK }}>HR. {book}</Text>
                    </View>
                    <View style={{ backgroundColor: '#FFF8EC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E2C675' }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#C8A84B' }}>No. {number}</Text>
                    </View>
                </View>

                {/* Arabic Card */}
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    padding: 24,
                    marginBottom: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.04)',
                }}>
                    {/* Quotation mark decoration */}
                    <View style={{ height: 3, backgroundColor: TEAL, borderRadius: 2, marginBottom: 20, width: 40, alignSelf: 'center' }} />
                    <Text style={{
                        fontFamily: 'NotoNaskhArabic',
                        fontSize: 28,
                        color: '#1a1a1a',
                        textAlign: 'right',
                        lineHeight: 52,
                    }}>
                        {arab}
                    </Text>
                    <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 12, color: '#bbb', fontStyle: 'italic' }}>— HR. {book}, No. {number}</Text>
                    </View>
                </View>

                {/* Terjemahan Card */}
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    padding: 20,
                    marginBottom: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.04)',
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{ width: 4, height: 18, backgroundColor: '#C8A84B', borderRadius: 2, marginRight: 8 }} />
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#C8A84B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Terjemahan</Text>
                    </View>

                    {/* Large opening quote */}
                    <Text style={{ fontSize: 40, color: '#E8E4DF', lineHeight: 36, marginBottom: -4 }}>"</Text>
                    <Text style={{ fontSize: 15, color: '#333', lineHeight: 26, marginHorizontal: 8 }}>
                        {terjemah}
                    </Text>
                    <Text style={{ fontSize: 40, color: '#E8E4DF', lineHeight: 36, textAlign: 'right', marginTop: -8 }}>"</Text>
                </View>

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', paddingVertical: 14, borderRadius: 14, gap: 8, borderWidth: 1, borderColor: '#E0DAD0' }}
                        onPress={handleCopy}
                        activeOpacity={0.7}
                    >
                        <Copy size={18} color={copied ? '#27ae60' : TEAL} />
                        <Text style={{ fontSize: 14, fontWeight: '600', color: copied ? '#27ae60' : TEAL }}>
                            {copied ? 'Tersalin!' : 'Salin'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: TEAL, paddingVertical: 14, borderRadius: 14, gap: 8, shadowColor: TEAL, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
                        onPress={handleShare}
                        activeOpacity={0.7}
                    >
                        <Share2 size={18} color="#fff" />
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Bagikan</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
