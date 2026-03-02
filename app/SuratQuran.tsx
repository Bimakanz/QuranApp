import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    BookmarkIcon,
    ChevronLeft,
    Play,
    Square,
    Volume2,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
interface Ayat {
    nomor: number;
    ar: string;
    tr: string;
    idn: string;
    audio: string;
}

interface SurahDetail {
    nomor: number;
    nama: string;
    nama_latin: string;
    jumlah_ayat: number;
    tempat_turun: string;
    arti: string;
    deskripsi: string;
    audio: string; // full surah audio
    ayat: Ayat[];
}

// Helper: buang semua tag HTML dari string
function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, '')   // hapus tag HTML
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .trim();
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────
export default function SuratQuran() {
    const { nomor } = useLocalSearchParams<{ nomor: string }>();
    const router = useRouter();

    const [surah, setSurah] = useState<SurahDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Audio state
    const soundRef = useRef<Audio.Sound | null>(null);
    const [playingAyat, setPlayingAyat] = useState<number | null>(null); // nomor ayat yang sedang diputar
    const [playingFull, setPlayingFull] = useState(false);

    // ── Fetch surah detail ────────────────────────────────
    useEffect(() => {
        fetch(`https://quran-api.santrikoding.com/api/surah/${nomor}`)
            .then((r) => r.json())
            .then((data: SurahDetail) => {
                setSurah(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Gagal memuat surah.');
                setLoading(false);
            });

        return () => {
            stopSound();
        };
    }, [nomor]);

    // ── Audio helpers ─────────────────────────────────────
    const stopSound = async () => {
        if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
            soundRef.current = null;
        }
        setPlayingAyat(null);
        setPlayingFull(false);
    };

    const playAudio = async (url: string, ayatNomor?: number) => {
        await stopSound();
        try {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const { sound } = await Audio.Sound.createAsync({ uri: url });
            soundRef.current = sound;
            if (ayatNomor !== undefined) {
                setPlayingAyat(ayatNomor);
            } else {
                setPlayingFull(true);
            }
            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setPlayingAyat(null);
                    setPlayingFull(false);
                }
            });
        } catch {
            // silently handle
        }
    };

    const toggleAyat = async (ayat: Ayat) => {
        if (playingAyat === ayat.nomor) {
            await stopSound();
        } else {
            await playAudio(ayat.audio, ayat.nomor);
        }
    };

    const toggleFull = async () => {
        if (playingFull) {
            await stopSound();
        } else if (surah?.audio) {
            await playAudio(surah.audio);
        }
    };

    // ── Render ayat item ──────────────────────────────────
    const renderAyat = ({ item }: { item: Ayat }) => {
        const isPlaying = playingAyat === item.nomor;
        return (
            <View style={styles.ayatCard}>
                {/* Top row: nomor + play + bookmark */}
                <View style={styles.ayatTopRow}>
                    <View style={styles.ayatNumBadge}>
                        <Text style={styles.ayatNumText}>{item.nomor}</Text>
                    </View>

                    <View style={styles.ayatActions}>
                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={() => toggleAyat(item)}
                            activeOpacity={0.7}
                        >
                            {isPlaying
                                ? <Square size={16} color="#728D8E" />
                                : <Play size={16} color="#728D8E" />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                            <BookmarkIcon size={16} color="#728D8E" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Arabic text */}
                <Text style={styles.arabicText}>{item.ar}</Text>

                {/* Latin transliteration — strip HTML tags */}
                <Text style={styles.latinText}>{stripHtml(item.tr)}</Text>

                {/* Indonesian translation */}
                <Text style={styles.idnText}>{item.idn}</Text>
            </View>
        );
    };

    // ── Separator ─────────────────────────────────────────
    const Separator = () => <View style={styles.separator} />;

    // ── States ────────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color="#728D8E" />
            </SafeAreaView>
        );
    }
    if (error || !surah) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>

            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>{surah.nama_latin}</Text>
                    <Text style={styles.headerSub}>
                        {surah.arti} • {surah.jumlah_ayat} Ayat • {surah.tempat_turun}
                    </Text>
                </View>

                <Text style={styles.headerArab}>{surah.nama}</Text>
            </View>

            {/* ── Divider ── */}
            <View style={styles.divider} />

            {/* ── Putar Full Surah button ── */}
            <TouchableOpacity
                style={[styles.fullPlayBtn, playingFull && styles.fullPlayBtnActive]}
                onPress={toggleFull}
                activeOpacity={0.8}
            >
                {playingFull
                    ? <Square size={18} color="#fff" />
                    : <Volume2 size={18} color="#fff" />
                }
                <Text style={styles.fullPlayText}>
                    {playingFull ? 'Stop' : 'Putar Full Surah'}
                </Text>
            </TouchableOpacity>

            {/* ── Ayat list ── */}
            <FlatList
                data={surah.ayat}
                keyExtractor={(item) => String(item.nomor)}
                renderItem={renderAyat}
                ItemSeparatorComponent={Separator}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────
const BG = '#F5F0E8';
const TEAL = '#728D8E';
const GOLD = '#C8A84B';

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: BG,
        paddingTop: 20,
    },
    center: {
        flex: 1,
        backgroundColor: BG,
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
    },
    backBtn: {
        padding: 4,
    },
    headerCenter: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    headerSub: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    headerArab: {
        fontSize: 20,
        color: TEAL,
        fontFamily: 'NotoNaskhArabic',
        writingDirection: 'rtl',
    },

    /* Divider */
    divider: {
        height: 1,
        backgroundColor: 'rgba(16, 16, 16, 0.1)',
        marginHorizontal: 1,
        marginBottom: 14,
    },

    /* Full play button */
    fullPlayBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: TEAL,
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 12,
        paddingVertical: 12,
    },
    fullPlayBtnActive: {
        backgroundColor: '#5a7273',
    },
    fullPlayText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },

    /* List */
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 110,
    },

    /* Ayat card */
    ayatCard: {
        paddingVertical: 16,
    },
    ayatTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    ayatNumBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: TEAL,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ayatNumText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    ayatActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        padding: 6,
    },

    /* Arabic */
    arabicText: {
        fontSize: 26,
        color: '#1a1a1a',
        fontFamily: 'NotoNaskhArabic',
        textAlign: 'right',
        writingDirection: 'rtl',
        lineHeight: 48,
        marginBottom: 10,
    },

    /* Latin transliteration */
    latinText: {
        fontSize: 13,
        color: GOLD,
        fontStyle: 'italic',
        marginBottom: 6,
        lineHeight: 20,
    },

    /* Indonesian translation */
    idnText: {
        fontSize: 13,
        color: '#555',
        lineHeight: 20,
    },

    /* Separator */
    separator: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.07)',
    },

    /* Error */
    errorText: {
        color: '#c0392b',
        fontSize: 14,
    },
});
