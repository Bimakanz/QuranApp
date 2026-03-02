import { useRouter } from 'expo-router';
import { Bookmark, BookOpen, Search, Settings } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
interface Surah {
    nomor: number;
    nama: string;
    nama_latin: string;
    arti: string;
    jumlah_ayat: number;
    tempat_turun: string; // "mekah" | "madinah"
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────
export default function AlQuran() {
    const router = useRouter();
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [filtered, setFiltered] = useState<Surah[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('https://quran-api.santrikoding.com/api/surah')
            .then((r) => r.json())
            .then((data: Surah[]) => {
                setSurahs(data);
                setFiltered(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Gagal memuat data. Coba lagi.');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(
            surahs.filter(
                (s) =>
                    s.nama_latin.toLowerCase().includes(q) ||
                    s.arti.toLowerCase().includes(q) ||
                    String(s.nomor).includes(q),
            ),
        );
    }, [search, surahs]);

    // ── Render item ──────────────────────────────────────
    const renderItem = ({ item }: { item: Surah }) => (
        <TouchableOpacity
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => router.push(`/SuratQuran?nomor=${item.nomor}`)}
        >
            {/* Nomor dengan ayat.png */}
            <View style={styles.numberBadge}>
                <Image
                    source={require('../../assets/images/ayat.png')}
                    style={styles.ayatImg}
                    resizeMode="contain"
                />
                <Text style={styles.numberText}>{item.nomor}</Text>
            </View>

            {/* Info kiri */}
            <View style={styles.infoLeft}>
                <Text style={styles.nameLatin}>{item.nama_latin}</Text>
                <Text style={styles.subInfo}>
                    {item.arti} • {item.jumlah_ayat} Ayat
                </Text>
            </View>

            {/* Info kanan */}
            <View style={styles.infoRight}>
                <Text style={styles.namaArab}>{item.nama}</Text>
                <Text style={styles.tempatTurun}>
                    {item.tempat_turun.charAt(0).toUpperCase() + item.tempat_turun.slice(1)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    // ── Separator ────────────────────────────────────────
    const Separator = () => <View style={styles.separator} />;

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <BookOpen size={22} color="#333" />
                    <Text style={styles.headerTitle}>Al-Quran</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Bookmark size={20} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Settings size={20} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Search bar ── */}
            <View style={styles.searchWrapper}>
                <Search size={16} color="#aaa" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari surah..."
                    placeholderTextColor="#aaa"
                    value={search}
                    onChangeText={setSearch}
                    clearButtonMode="while-editing"
                />
            </View>

            {/* ── List ── */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#C8A84B" />
                    <Text style={styles.loadingText}>Memuat surah...</Text>
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => String(item.nomor)}
                    renderItem={renderItem}
                    ItemSeparatorComponent={Separator}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────
const GOLD = '#C8A84B';
const BG = '#F5F0E8';

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: BG,
        paddingTop: 20,
    },

    /* Header */
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 10,
    },
    iconBtn: {
        padding: 4,
    },

    /* Search */
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },

    /* List */
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },

    /* Item */
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        gap: 14,
    },
    numberBadge: {
        width: 65,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ayatImg: {
        position: 'absolute',
        width: 65,
        height: 65,
    },
    numberText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#728D8E',
        zIndex: 1,
    },
    infoLeft: {
        flex: 1,
    },
    nameLatin: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    subInfo: {
        fontSize: 12,
        color: '#888',
        marginTop: 3,
    },
    infoRight: {
        alignItems: 'flex-end',
    },
    namaArab: {
        fontSize: 20,
        color: '#728D8E',
        fontFamily: 'NotoNaskhArabic',
        writingDirection: 'rtl',
    },
    tempatTurun: {
        fontSize: 11,
        color: '#888',
        marginTop: 3,
        textTransform: 'capitalize',
    },

    /* Separator */
    separator: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.07)',
    },

    /* States */
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        color: '#888',
        fontSize: 14,
    },
    errorText: {
        color: '#c0392b',
        fontSize: 14,
    },
});
