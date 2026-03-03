import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Copy, RefreshCw, Share2 } from 'lucide-react-native';
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

export default function DetailDzikir() {
    const router = useRouter();
    const { type, arab, indo, ulang } = useLocalSearchParams();
    const [copied, setCopied] = useState(false);
    const [counter, setCounter] = useState(0);
    const repeatCount = typeof ulang === 'string' ? parseInt(ulang) || 1 : 1;

    const typeLabel = typeof type === 'string'
        ? type.charAt(0).toUpperCase() + type.slice(1)
        : 'Dzikir';

    const handleCopy = () => {
        const text = `${arab}\n\nArtinya:\n${indo}\n\nDibaca: ${ulang}x`;
        Clipboard.setString(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        try {
            await Share.share({ message: `${arab}\n\nArtinya:\n${indo}\n\nDibaca: ${ulang}x` });
        } catch { }
    };

    const incrementCounter = () => {
        if (counter < repeatCount) setCounter(counter + 1);
    };

    const resetCounter = () => setCounter(0);

    const progress = repeatCount > 0 ? counter / repeatCount : 0;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color={TEAL} />
                </TouchableOpacity>
                <Text style={{ flex: 1, fontSize: 17, fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginHorizontal: 12 }}>
                    Detail Dzikir
                </Text>
                <View style={{ width: 32 }} />
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.05)' }} />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

                {/* Badges */}
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                    <View style={{ backgroundColor: '#E8F0F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: TEAL_DARK }}>Dzikir {typeLabel}</Text>
                    </View>
                    <View style={{ backgroundColor: '#FFF8EC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E2C675' }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#C8A84B' }}>Dibaca {ulang}</Text>
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

                {/* Terjemahan Card */}
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
                        <Text style={{ fontSize: 13, fontWeight: '700', color: TEAL, textTransform: 'uppercase', letterSpacing: 0.5 }}>Terjemahan</Text>
                    </View>
                    <Text style={{ fontSize: 15, color: '#333', lineHeight: 26 }}>{indo}</Text>
                </View>

                {/* Counter Card */}
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    padding: 24,
                    marginBottom: 24,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.04)',
                }}>
                    <Text style={{ fontSize: 13, color: '#999', marginBottom: 12 }}>Hitung Dzikir</Text>

                    {/* Progress bar */}
                    <View style={{ width: '100%', height: 6, backgroundColor: '#F0EDE8', borderRadius: 3, marginBottom: 16 }}>
                        <View style={{ width: `${progress * 100}%`, height: 6, backgroundColor: TEAL, borderRadius: 3 }} />
                    </View>

                    <Text style={{ fontSize: 48, fontWeight: '700', color: TEAL, lineHeight: 56 }}>{counter}</Text>
                    <Text style={{ fontSize: 13, color: '#bbb', marginBottom: 20 }}>dari {repeatCount}×</Text>

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity
                            style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' }}
                            onPress={resetCounter}
                            activeOpacity={0.7}
                        >
                            <RefreshCw size={18} color="#aaa" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flex: 1, paddingVertical: 14, backgroundColor: counter >= repeatCount ? '#27ae60' : TEAL, borderRadius: 14, alignItems: 'center', shadowColor: TEAL, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
                            onPress={incrementCounter}
                            activeOpacity={0.8}
                        >
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                                {counter >= repeatCount ? '✓ Selesai' : 'Dzikir +1'}
                            </Text>
                        </TouchableOpacity>
                    </View>
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
