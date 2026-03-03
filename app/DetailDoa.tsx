import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Copy, Heart, Share2 } from 'lucide-react-native';
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

export default function DetailDoa() {
    const router = useRouter();
    const { title, arab, latin, arti } = useLocalSearchParams();
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(false);

    const handleCopy = () => {
        const copyText = `${title}\n\n${arab}\n\nLatin: ${latin}\n\nArti: ${arti}`;
        Clipboard.setString(String(copyText));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${title}\n\n${arab}\n\nLatin: ${latin}\n\nArti: ${arti}\n\nDibagikan dari QuranApp`,
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
                <Text style={{ flex: 1, fontSize: 17, fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginHorizontal: 12 }} numberOfLines={1}>
                    {title}
                </Text>
                <TouchableOpacity onPress={() => setLiked(!liked)} style={{ padding: 4 }}>
                    <Heart size={22} color={liked ? '#e74c3c' : TEAL} fill={liked ? '#e74c3c' : 'transparent'} />
                </TouchableOpacity>
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.05)' }} />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

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
                    {/* Arabic decorative top line */}
                    <View style={{ height: 3, backgroundColor: TEAL, borderRadius: 2, marginBottom: 20, width: 40, alignSelf: 'center' }} />
                    <Text style={{
                        fontFamily: 'NotoNaskhArabic',
                        fontSize: 30,
                        color: '#1a1a1a',
                        textAlign: 'right',
                        lineHeight: 54,
                    }}>
                        {arab}
                    </Text>
                </View>

                {/* Latin Card */}
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    padding: 20,
                    marginBottom: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.04)',
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <View style={{ width: 4, height: 18, backgroundColor: TEAL, borderRadius: 2, marginRight: 8 }} />
                        <Text style={{ fontSize: 13, fontWeight: '700', color: TEAL, textTransform: 'uppercase', letterSpacing: 0.5 }}>Latin</Text>
                    </View>
                    <Text style={{ fontSize: 15, color: '#555', lineHeight: 26, fontStyle: 'italic' }}>
                        {latin}
                    </Text>
                </View>

                {/* Arti Card */}
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <View style={{ width: 4, height: 18, backgroundColor: '#C8A84B', borderRadius: 2, marginRight: 8 }} />
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#C8A84B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Artinya</Text>
                    </View>
                    <Text style={{ fontSize: 15, color: '#333', lineHeight: 26 }}>
                        {arti}
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', paddingVertical: 14, borderRadius: 14, gap: 8, borderWidth: 1, borderColor: '#E0DAD0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
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
