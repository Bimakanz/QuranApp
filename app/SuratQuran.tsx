import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    BookmarkIcon, ChevronLeft, ChevronRight,
    Music2, Pause, Play, Square, Volume2
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEAL = '#728D8E';
const BG = '#F5F0E8';
const GOLD = '#C8A84B';

const QARIS = [
    { id: '05', name: 'Misyari Rasyid Al-Afasi' },
    { id: '03', name: 'Abdurrahman As-Sudais' },
    { id: '01', name: 'Abdullah Al-Juhany' },
    { id: '02', name: 'Abdul Muhsin Al-Qasim' },
    { id: '04', name: 'Ibrahim Al-Dossari' },
    { id: '06', name: 'Yasser Al-Dosari' },
];

interface Ayat {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
    audio: Record<string, string>;
}

interface SurahDetail {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    tempatTurun: string;
    arti: string;
    deskripsi: string;
    audioFull: Record<string, string>;
    ayat: Ayat[];
    suratSelanjutnya: { nomor: number; namaLatin: string } | false;
    suratSebelumnya: { nomor: number; namaLatin: string } | false;
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();
}

export default function SuratQuran() {
    const { nomor } = useLocalSearchParams<{ nomor: string }>();
    const router = useRouter();

    const [surah, setSurah] = useState<SurahDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedQari, setSelectedQari] = useState(QARIS[0]);
    const [showQariModal, setShowQariModal] = useState(false);

    // Audio state
    const soundRef = useRef<Audio.Sound | null>(null);
    const [playingAyat, setPlayingAyat] = useState<number | null>(null);
    const [playingFull, setPlayingFull] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const autoPlayIndexRef = useRef<number>(-1);

    const fetchSurah = useCallback((num: string) => {
        setLoading(true);
        setError('');
        fetch(`https://equran.id/api/v2/surat/${num}`)
            .then((r) => r.json())
            .then((res) => { setSurah(res.data); setLoading(false); })
            .catch(() => { setError('Gagal memuat surah.'); setLoading(false); });
    }, []);

    useEffect(() => {
        fetchSurah(nomor);
        return () => { stopSound(); };
    }, [nomor]);

    const stopSound = async () => {
        autoPlayIndexRef.current = -1;
        if (soundRef.current) {
            try {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
            } catch { }
            soundRef.current = null;
        }
        setPlayingAyat(null);
        setPlayingFull(false);
        setIsLoading(false);
    };

    const playAudio = async (url: string, ayatNomor?: number, autoNextIndex?: number) => {
        await stopSound();
        try {
            setIsLoading(true);
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const { sound } = await Audio.Sound.createAsync({ uri: url });
            soundRef.current = sound;
            setIsLoading(false);

            if (ayatNomor !== undefined) setPlayingAyat(ayatNomor);
            else setPlayingFull(true);

            if (autoNextIndex !== undefined) autoPlayIndexRef.current = autoNextIndex;

            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    const nextIndex = autoPlayIndexRef.current;
                    if (nextIndex >= 0 && surah && nextIndex < surah.ayat.length) {
                        // Auto-play next ayat
                        const nextAyat = surah.ayat[nextIndex];
                        const nextUrl = nextAyat.audio[selectedQari.id];
                        playAudio(nextUrl, nextAyat.nomorAyat, nextIndex + 1);
                    } else {
                        setPlayingAyat(null);
                        setPlayingFull(false);
                        autoPlayIndexRef.current = -1;
                    }
                }
            });
        } catch {
            setIsLoading(false);
        }
    };

    const toggleAyat = async (ayat: Ayat) => {
        if (playingAyat === ayat.nomorAyat) {
            await stopSound();
        } else {
            const url = ayat.audio[selectedQari.id];
            if (url) await playAudio(url, ayat.nomorAyat, -1);
        }
    };

    const toggleFullSurah = async () => {
        if (playingFull || playingAyat !== null) {
            await stopSound();
        } else if (surah) {
            // Play full surah audio (1 track)
            const url = surah.audioFull[selectedQari.id];
            if (url) await playAudio(url, undefined, -1);
        }
    };

    const playFromAyat = async (startIndex: number) => {
        if (!surah) return;
        await stopSound();
        const ayat = surah.ayat[startIndex];
        const url = ayat.audio[selectedQari.id];
        if (url) await playAudio(url, ayat.nomorAyat, startIndex + 1);
    };

    const renderAyat = ({ item, index }: { item: Ayat; index: number }) => {
        const isPlaying = playingAyat === item.nomorAyat;
        return (
            <View style={{ paddingVertical: 16 }}>
                {/* Ayat header row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    {/* Ayat number badge */}
                    <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: GOLD, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>{item.nomorAyat}</Text>
                    </View>

                    {/* Action buttons */}
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        {/* Play/Stop per ayat */}
                        <TouchableOpacity
                            style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: isPlaying ? TEAL : '#E8E2D9', alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => toggleAyat(item)}
                            activeOpacity={0.7}
                        >
                            {isPlaying
                                ? <Square size={14} color="#fff" />
                                : (isLoading ? <ActivityIndicator size="small" color={TEAL} /> : <Play size={14} color={TEAL} />)
                            }
                        </TouchableOpacity>

                        {/* Play from this ayat continuously */}
                        <TouchableOpacity
                            style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8E2D9', alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => playFromAyat(index)}
                            activeOpacity={0.7}
                        >
                            <ChevronRight size={14} color={TEAL} />
                        </TouchableOpacity>

                        {/* Bookmark */}
                        <TouchableOpacity
                            style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8E2D9', alignItems: 'center', justifyContent: 'center' }}
                            activeOpacity={0.7}
                        >
                            <BookmarkIcon size={14} color={TEAL} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Arabic */}
                <Text style={{ fontFamily: 'NotoNaskhArabic', fontSize: 28, color: '#1a1a1a', textAlign: 'right', lineHeight: 52, marginBottom: 12 }}>
                    {item.teksArab}
                </Text>

                {/* Latin */}
                <Text style={{ fontSize: 13, color: TEAL, fontStyle: 'italic', lineHeight: 22, marginBottom: 8 }}>
                    {stripHtml(item.teksLatin)}
                </Text>

                {/* Indonesian */}
                <Text style={{ fontSize: 14, color: '#555', lineHeight: 22 }}>
                    {item.teksIndonesia}
                </Text>
            </View>
        );
    };

    const Separator = () => <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.07)' }} />;

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: BG, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={TEAL} />
                <Text style={{ marginTop: 12, color: TEAL, fontSize: 14 }}>Memuat surah...</Text>
            </SafeAreaView>
        );
    }

    if (error || !surah) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: BG, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                <Text style={{ color: '#c0392b', fontSize: 14 }}>{error || 'Data tidak tersedia.'}</Text>
                <TouchableOpacity onPress={() => fetchSurah(nomor)} style={{ backgroundColor: TEAL, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 }}>
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Coba Lagi</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const isAnyPlaying = playingFull || playingAyat !== null;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.07)' }}>
                <TouchableOpacity onPress={() => { stopSound(); router.back(); }} style={{ padding: 4 }} activeOpacity={0.7}>
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a1a' }}>{surah.namaLatin}</Text>
                    <Text style={{ fontSize: 12, color: TEAL, marginTop: 2 }}>
                        {surah.arti} • {surah.jumlahAyat} Ayat • {surah.tempatTurun}
                    </Text>
                </View>
                <Text style={{ fontFamily: 'NotoNaskhArabic', fontSize: 22, color: '#1a1a1a' }}>{surah.nama}</Text>
            </View>

            {/* Audio Controls Bar */}
            <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingVertical: 12 }}>
                {/* Qari Selector */}
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1, borderColor: '#E0DAD0', gap: 6 }}
                    onPress={() => setShowQariModal(true)}
                    activeOpacity={0.7}
                >
                    <Music2 size={14} color={TEAL} />
                    <Text style={{ fontSize: 12, color: '#444', flex: 1 }} numberOfLines={1}>{selectedQari.name}</Text>
                </TouchableOpacity>

                {/* Play Full Surah */}
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isAnyPlaying ? '#5a7273' : TEAL, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9, gap: 6 }}
                    onPress={toggleFullSurah}
                    activeOpacity={0.8}
                >
                    {isLoading
                        ? <ActivityIndicator size="small" color="#fff" />
                        : isAnyPlaying
                            ? <Pause size={16} color="#fff" />
                            : <Volume2 size={16} color="#fff" />
                    }
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
                        {isAnyPlaying ? 'Stop' : 'Putar'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Now Playing Indicator */}
            {isAnyPlaying && (
                <View style={{ marginHorizontal: 20, marginBottom: 8, backgroundColor: '#E8F0F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: TEAL }} />
                    <Text style={{ fontSize: 12, color: TEAL, flex: 1 }}>
                        {playingFull ? `Memutar full surah • ${selectedQari.name}` : `Memutar Ayat ${playingAyat} • ${selectedQari.name}`}
                    </Text>
                    <TouchableOpacity onPress={stopSound}>
                        <Square size={14} color={TEAL} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Surah List */}
            <FlatList
                data={surah.ayat}
                keyExtractor={(item) => String(item.nomorAyat)}
                renderItem={renderAyat}
                ItemSeparatorComponent={Separator}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
                showsVerticalScrollIndicator={false}
            />

            {/* Navigation: Prev / Next Surah */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.07)', backgroundColor: BG }}>
                {surah.suratSebelumnya ? (
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, opacity: 1 }}
                        onPress={() => router.replace({ pathname: '/SuratQuran', params: { nomor: String(surah.suratSebelumnya && surah.suratSebelumnya.nomor) } } as any)}
                        activeOpacity={0.7}
                    >
                        <ChevronLeft size={16} color={TEAL} />
                        <Text style={{ fontSize: 13, color: TEAL }}>{(surah.suratSebelumnya as any).namaLatin}</Text>
                    </TouchableOpacity>
                ) : <View />}

                {surah.suratSelanjutnya && (
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                        onPress={() => router.replace({ pathname: '/SuratQuran', params: { nomor: String((surah.suratSelanjutnya as any).nomor) } } as any)}
                        activeOpacity={0.7}
                    >
                        <Text style={{ fontSize: 13, color: TEAL }}>{(surah.suratSelanjutnya as any).namaLatin}</Text>
                        <ChevronRight size={16} color={TEAL} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Qari Picker Modal */}
            <Modal visible={showQariModal} transparent animationType="slide" onRequestClose={() => setShowQariModal(false)}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} activeOpacity={1} onPress={() => setShowQariModal(false)} />
                <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40 }}>
                    <View style={{ alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
                        <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#ddd', marginBottom: 12 }} />
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1a1a1a' }}>Pilih Qari</Text>
                    </View>
                    {QARIS.map((qari) => (
                        <TouchableOpacity
                            key={qari.id}
                            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f8f8f8' }}
                            onPress={() => { setSelectedQari(qari); setShowQariModal(false); stopSound(); }}
                            activeOpacity={0.7}
                        >
                            <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: selectedQari.id === qari.id ? TEAL : '#ddd', backgroundColor: selectedQari.id === qari.id ? TEAL : 'transparent', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                                {selectedQari.id === qari.id && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />}
                            </View>
                            <Text style={{ fontSize: 15, color: selectedQari.id === qari.id ? TEAL : '#333', fontWeight: selectedQari.id === qari.id ? '600' : '400' }}>
                                {qari.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </SafeAreaView>
    );
}
