import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookmarkIcon, ChevronLeft, Play, Square, Volume2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEAL = '#728D8E';
const BG = '#F5F0E8';
const GOLD = '#C8A84B';

interface Ayat { nomor: number; ar: string; tr: string; idn: string; audio: string; }
interface SurahDetail { nomor: number; nama: string; nama_latin: string; jumlah_ayat: number; tempat_turun: string; arti: string; deskripsi: string; audio: string; ayat: Ayat[]; }

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();
}

export default function SuratQuran() {
    const { nomor } = useLocalSearchParams<{ nomor: string }>();
    const router = useRouter();
    const [surah, setSurah] = useState<SurahDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const soundRef = useRef<Audio.Sound | null>(null);
    const [playingAyat, setPlayingAyat] = useState<number | null>(null);
    const [playingFull, setPlayingFull] = useState(false);

    useEffect(() => {
        fetch(`https://quran-api.santrikoding.com/api/surah/${nomor}`)
            .then((r) => r.json())
            .then((data: SurahDetail) => { setSurah(data); setLoading(false); })
            .catch(() => { setError('Gagal memuat surah.'); setLoading(false); });
        return () => { stopSound(); };
    }, [nomor]);

    const stopSound = async () => {
        if (soundRef.current) { await soundRef.current.stopAsync(); await soundRef.current.unloadAsync(); soundRef.current = null; }
        setPlayingAyat(null); setPlayingFull(false);
    };

    const playAudio = async (url: string, ayatNomor?: number) => {
        await stopSound();
        try {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const { sound } = await Audio.Sound.createAsync({ uri: url });
            soundRef.current = sound;
            if (ayatNomor !== undefined) setPlayingAyat(ayatNomor); else setPlayingFull(true);
            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) { setPlayingAyat(null); setPlayingFull(false); }
            });
        } catch { }
    };

    const toggleAyat = async (ayat: Ayat) => {
        if (playingAyat === ayat.nomor) await stopSound(); else await playAudio(ayat.audio, ayat.nomor);
    };

    const toggleFull = async () => {
        if (playingFull) await stopSound(); else if (surah?.audio) await playAudio(surah.audio);
    };

    const renderAyat = ({ item }: { item: Ayat }) => {
        const isPlaying = playingAyat === item.nomor;
        return (
            <View style={{ paddingVertical: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: GOLD, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>{item.nomor}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8E2D9', alignItems: 'center', justifyContent: 'center' }} onPress={() => toggleAyat(item)} activeOpacity={0.7}>
                            {isPlaying ? <Square size={16} color={TEAL} /> : <Play size={16} color={TEAL} />}
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8E2D9', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.7}>
                            <BookmarkIcon size={16} color={TEAL} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ fontFamily: 'NotoNaskhArabic', fontSize: 26, color: '#1a1a1a', textAlign: 'right', lineHeight: 48, marginBottom: 12 }}>{item.ar}</Text>
                <Text style={{ fontSize: 13, color: TEAL, fontStyle: 'italic', lineHeight: 20, marginBottom: 8 }}>{stripHtml(item.tr)}</Text>
                <Text style={{ fontSize: 14, color: '#555', lineHeight: 20 }}>{item.idn}</Text>
            </View>
        );
    };

    const Separator = () => <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.07)' }} />;

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: BG, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={TEAL} />
            </SafeAreaView>
        );
    }

    if (error || !surah) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: BG, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#c0392b', fontSize: 14 }}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.07)' }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }} activeOpacity={0.7}>
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a1a' }}>{surah.nama_latin}</Text>
                    <Text style={{ fontSize: 12, color: TEAL, marginTop: 2 }}>
                        {surah.arti} • {surah.jumlah_ayat} Ayat • {surah.tempat_turun}
                    </Text>
                </View>
                <Text style={{ fontFamily: 'NotoNaskhArabic', fontSize: 22, color: '#1a1a1a' }}>{surah.nama}</Text>
            </View>

            {/* Play Full Surah */}
            <TouchableOpacity
                style={[{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: TEAL, marginHorizontal: 20, marginVertical: 12,
                    borderRadius: 12, paddingVertical: 12, gap: 8
                }, playingFull && { backgroundColor: '#5a7273' }]}
                onPress={toggleFull}
                activeOpacity={0.8}
            >
                {playingFull ? <Square size={18} color="#fff" /> : <Volume2 size={18} color="#fff" />}
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>{playingFull ? 'Stop' : 'Putar Full Surah'}</Text>
            </TouchableOpacity>

            <FlatList
                data={surah.ayat}
                keyExtractor={(item) => String(item.nomor)}
                renderItem={renderAyat}
                ItemSeparatorComponent={Separator}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}
